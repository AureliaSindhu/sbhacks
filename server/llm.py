from openai import AsyncOpenAI
from typing import List
import os
from custom_types import (
    ResponseRequiredRequest,
    ResponseResponse,
    Utterance,
)
import logging
from prompts import system_prompt, begin_sentence
import json
from db import get_current_article, search_for_notes


class LlmClient:
    def __init__(self, manager):
        self.client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
        self.manager = manager

    # Step 1: Prepare the function calling definition to the prompt
    def prepare_functions(self):
        functions = [
            {
                "type": "function",
                "function": {
                    "name": "search_for_notes",
                    "description": "Search for notes in the database given a query.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "The query to search for notes in the database.",
                            },
                        },
                        "required": ["query"],
                    },
                },
            },
        ]
        return functions

    def draft_begin_message(self):
        response = ResponseResponse(
            response_id=0,
            content=begin_sentence,
            content_complete=True,
            end_call=False,
        )
        return response

    def convert_transcript_to_openai_messages(self, transcript: List[Utterance]):
        messages = []
        for utterance in transcript:
            if utterance.role == "agent":
                messages.append({"role": "assistant", "content": utterance.content})
            else:
                messages.append({"role": "user", "content": utterance.content})
        return messages

    def prepare_prompt(self, request: ResponseRequiredRequest):
        current_article = get_current_article()
        prompt = [
            {
                "role": "system",
                "content": system_prompt,
            }
        ]
        transcript_messages = self.convert_transcript_to_openai_messages(
            request.transcript
        )
        for message in transcript_messages:
            prompt.append(message)

        prompt.append(
            {
                "role": "user",
                "content": "Current note pages:\n" + current_article,
            }
        )

        if request.interaction_type == "reminder_required":
            prompt.append(
                {
                    "role": "user",
                    "content": "(Now the user has not responded in a while, you would say:)",
                }
            )
        return prompt

    async def draft_response(self, request: ResponseRequiredRequest):
        prompt = self.prepare_prompt(request)
        func_call = {}
        func_arguments = ""

        stream = await self.client.chat.completions.create(
            model="gpt-4o",
            temperature=0.7,
            messages=prompt,
            stream=True,
            tools=self.prepare_functions(),
        )

        async for chunk in stream:
            if len(chunk.choices) == 0:
                continue

            if chunk.choices[0].delta.tool_calls:
                tool_calls = chunk.choices[0].delta.tool_calls[0]
                if tool_calls.id:
                    func_call = {
                        "id": tool_calls.id,
                        "func_name": tool_calls.function.name or "",
                        "arguments": {},
                    }
                else:
                    # append argument
                    func_arguments += tool_calls.function.arguments or ""

            if chunk.choices[0].delta.content:
                response = ResponseResponse(
                    response_id=request.response_id,
                    content=chunk.choices[0].delta.content,
                    content_complete=False,
                    end_call=False,
                )
                yield response

        # Step 4: Call the functions
        if func_call:
            print(f"Function call: {func_call}")
            print(f"Function arguments: {func_arguments}")
            if func_call["func_name"] == "search_for_notes":
                func_call["arguments"] = json.loads(func_arguments)
                print("Executing search_for_notes")
                print(func_call["arguments"]["query"])
                result = search_for_notes(func_call["arguments"]["query"])

                self.manager.broadcast(
                    {
                        "event": "new_notes",
                        "data": result["file_name"],
                    }
                )

                logging.info(f"New Search Result:\n{result}")

                prompt.append(
                    {
                        "role": "user",
                        "content": "New Search Result:\n" + result["content"],
                    }
                )

                stream = await self.client.chat.completions.create(
                    model="gpt-4o",
                    temperature=0.7,
                    messages=prompt,
                    stream=True,
                    tools=self.prepare_functions(),
                )

                async for chunk in stream:
                    if len(chunk.choices) == 0:
                        continue
                    if chunk.choices[0].delta.content:
                        response = ResponseResponse(
                            response_id=request.response_id,
                            content=chunk.choices[0].delta.content,
                            content_complete=False,
                            end_call=False,
                        )
                        yield response
        else:
            # No functions, complete response
            response = ResponseResponse(
                response_id=request.response_id,
                content="",
                content_complete=True,
                end_call=False,
            )
            yield response
