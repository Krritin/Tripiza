import { useState } from 'react';

function ShareModal({ shareableUUID, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/share/${shareableUUID}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Share Your Trip</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Share this link with others to let them view your itinerary (read-only):
          </p>

          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 break-all text-sm text-gray-700">
            {shareUrl}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;