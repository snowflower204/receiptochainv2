'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Sidebar from '@/app/sidebar';

export default function ReceiptPage() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState({
    name: 'Juan Dela Cruz',
    date: new Date().toLocaleDateString(),
    items: [
      { description: 'Item A', amount: 100 },
      { description: 'Item B', amount: 200 }
    ],
    total: 300
  });

  const handleDownload = async (type: 'png' | 'jpeg') => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const link = document.createElement('a');
      link.download = `receipt.${type}`;
      link.href = canvas.toDataURL(`image/${type}`);
      link.click();
    }
  };

  const handleChange = (field: string, value: any) => {
    setReceiptData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Receipt Generator</h1>

        {/* Editable Form */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <label className="block mb-2">Customer Name</label>
          <input
            type="text"
            value={receiptData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={receiptData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block mb-2">Total</label>
          <input
            type="number"
            value={receiptData.total}
            onChange={(e) => handleChange('total', parseFloat(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          />
        </div>

        {/* Receipt Preview */}
        <div className="bg-white p-6 rounded shadow w-full max-w-lg" ref={receiptRef}>
          <h2 className="text-xl font-bold text-center mb-2">RECEIPT</h2>
          <p><strong>Name:</strong> {receiptData.name}</p>
          <p><strong>Date:</strong> {receiptData.date}</p>

          <table className="w-full mt-4 mb-4 text-left">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>₱{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-right font-bold">Total: ₱{receiptData.total}</p>
        </div>

        {/* Download Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => handleDownload('png')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Download as PNG
          </button>
          <button
            onClick={() => handleDownload('jpeg')}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Download as JPEG
          </button>
        </div>
      </div>
    </div>
  );
}
