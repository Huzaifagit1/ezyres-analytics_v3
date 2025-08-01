"use client";
import { useEffect, useState } from "react";

export default function NegotiationMarginTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/negotiation-margin`);
        const json = await res.json();
        setData(json.data || []);
      } catch (error) {
        console.error("Error fetching negotiation margin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  if (loading) return <p>Loading negotiation margin data...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold text-gray-700 text-sm mb-4">Negotiation Margin Table</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Address</th>
              <th className="border px-4 py-2 text-right">Price ($)</th>
              <th className="border px-4 py-2 text-right">Dispo Price ($)</th>
              <th className="border px-4 py-2 text-right">Negotiation Margin ($)</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.address}</td>
                <td className="border px-4 py-2 text-right">{item.price.toLocaleString()}</td>
                <td className="border px-4 py-2 text-right">{item.dispo_price.toLocaleString()}</td>
                <td className="border px-4 py-2 text-right text-green-600 font-medium">
                  {item.negotiation_margin.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"}`}
        >
          Previous
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
