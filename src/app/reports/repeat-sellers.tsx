"use client";
import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RepeatSellersChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepeatSellers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/repeat-sellers`);
        const data = await res.json();

        if (data.success) {
          // Sort sellers by submission count and pick top 10
          const sorted = data.data
            .sort((a, b) => Number(b.submission_count) - Number(a.submission_count))
            .slice(0, 10);

          const emails = sorted.map((s) => s.email);
          const counts = sorted.map((s) => Number(s.submission_count));

          setChartData({
            labels: emails,
            datasets: [
              {
                label: "Submissions",
                data: counts,
                backgroundColor: "rgba(37, 99, 235, 0.6)", // Blue
                borderColor: "#1e3a8a",
                borderWidth: 1,
                borderRadius: 6,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error fetching repeat sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepeatSellers();
  }, []);

  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        callbacks: {
          label: (context) => `${context.parsed.x} submissions`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.1)" },
        ticks: { color: "#64748b", font: { size: 12 } },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#334155",
          font: { size: 11 },
          callback: (value) => chartData.labels[value].split("@")[0], // Show prefix of email only
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 flex items-center justify-center h-[400px]">
        <p className="text-slate-500">Loading repeat sellers chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Top Repeat Sellers</h3>
      <div className="h-[400px]">
        {chartData ? <Bar data={chartData} options={options} /> : <p>No data available</p>}
      </div>
    </div>
  );
}
