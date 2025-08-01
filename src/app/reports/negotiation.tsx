"use client";
import { useEffect, useState } from "react";

export default function NegotiationMarginTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <p className="text-slate-200 text-lg font-medium">Loading negotiation margin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 border-b border-slate-600/50">
        <h3 className="font-bold text-white text-xl tracking-tight flex items-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
          Negotiation Margin Analysis
        </h3>
        <p className="text-slate-300 text-sm mt-1">Real estate investment opportunities with profit margins</p>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600/50">
              <th className="px-6 py-4 text-left text-slate-200 font-semibold text-sm uppercase tracking-wider">
                Property Address
              </th>
              <th className="px-6 py-4 text-right text-slate-200 font-semibold text-sm uppercase tracking-wider">
                Market Price
              </th>
              <th className="px-6 py-4 text-right text-slate-200 font-semibold text-sm uppercase tracking-wider">
                Dispo Price
              </th>
              <th className="px-6 py-4 text-right text-slate-200 font-semibold text-sm uppercase tracking-wider">
                Profit Margin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {currentRows.map((item, index) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-800/60 transition-all duration-300 group"
              >
                <td className="px-6 py-5 text-slate-100 font-medium">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="group-hover:text-white transition-colors duration-300">
                      {item.address}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right text-slate-200 font-semibold">
                  <span className="bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600/30">
                    ${item.price.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-5 text-right text-slate-200 font-semibold">
                  <span className="bg-blue-900/30 text-blue-200 px-3 py-1 rounded-lg border border-blue-700/30">
                    ${item.dispo_price.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                    ${item.negotiation_margin.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-t border-slate-600/50">
        <div className="flex justify-between items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentPage === 1
                ? "bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600"
                : "bg-gradient-to-r from-slate-600 to-slate-500 text-white hover:from-slate-500 hover:to-slate-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-slate-500"
            }`}
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-slate-200 font-medium">
              Page <span className="text-emerald-400 font-bold">{currentPage}</span> of{" "}
              <span className="text-emerald-400 font-bold">{totalPages}</span>
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-full font-semibold transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentPage === totalPages
                ? "bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600"
                : "bg-gradient-to-r from-slate-600 to-slate-500 text-white hover:from-slate-500 hover:to-slate-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-slate-500"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}