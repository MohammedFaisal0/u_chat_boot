// app/components/admin/PDFGuidelines.jsx
"use client";

import { useState } from "react";
import { FileText, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function PDFGuidelines() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
      >
        <Info size={20} />
        PDF Guidelines
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" />
            PDF Guidelines
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle size={20} />
              Recommended PDF Specifications
            </h3>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• <strong>File Size:</strong> Up to 10 MB (optimal: 1-5 MB)</li>
              <li>• <strong>Pages:</strong> Up to 100 pages (optimal: 10-50 pages)</li>
              <li>• <strong>Text Length:</strong> Up to 100,000 characters (optimal: 5,000-20,000)</li>
              <li>• <strong>Format:</strong> Text-based PDF (not scanned images)</li>
              <li>• <strong>Language:</strong> Arabic or English</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle size={20} />
              Important Notes
            </h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Large files (&gt;5 MB) may take longer to process</li>
              <li>• Text longer than 100,000 characters will be truncated</li>
              <li>• Scanned PDFs (images) cannot be processed</li>
              <li>• Complex layouts may not extract perfectly</li>
              <li>• Tables and charts may not be preserved</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Info size={20} />
              Best Practices
            </h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Use clear, readable fonts</li>
              <li>• Avoid complex formatting</li>
              <li>• Include relevant course information</li>
              <li>• Test with smaller files first</li>
              <li>• Review extracted content before creating instructions</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Processing Information
            </h3>
            <div className="text-gray-700 text-sm space-y-1">
              <p>• <strong>Text Extraction:</strong> Automatic using pdf-parse library</p>
              <p>• <strong>Processing Time:</strong> 1-10 seconds depending on file size</p>
              <p>• <strong>Storage:</strong> Original PDF + extracted text</p>
              <p>• <strong>Chatbot Integration:</strong> Text becomes part of bot knowledge</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
