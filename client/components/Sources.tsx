import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Sources() {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const pdfUrl = '../../../data/Circuit.pdf';

    return (
        <div className="h-full overflow-auto bg-gray-200 p-4 rounded-lg">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => console.error('Error loading PDF:', error)}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p className="text-center mt-4">
                Page {pageNumber} of {numPages}
            </p>
            <div className="flex justify-center mt-4 gap-4">
                <button
                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                    Previous
                </button>

                <button
                    onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
