import { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Sources() {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const pdfUrl = '../../../data/Circuit.pdf';

    const options = useMemo(() => ({ cMapUrl: 'cmaps/', cMapPacked: true }), []);

    return (
        <div className="h-full overflow-auto bg-gray-200 p-4 rounded-lg flex flex-col items-center">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
                onLoadError={(error) => console.error('Error loading PDF:', error)}
            >
                <div className="bg-white shadow-lg">
                    <Page pageNumber={pageNumber} />
                </div>
            </Document>
            <p className="text-center mt-4">
                Page {pageNumber} of {numPages}
            </p>
            <div className="flex justify-center mt-4 gap-4">
                <Button
                    onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-yellow-800 text-white rounded disabled:bg-gray-400"
                >
                    Previous
                </Button>
                <Button
                    onClick={() => setPageNumber(page => Math.min(page + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                    className="px-4 py-2 bg-yellow-400 text-white rounded disabled:bg-gray-400"
                    >
                    Next
                </Button>
            </div>
            </div>
    );
}
