'use client';
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DealData {
  city: string;
  deal_count: number;
}

interface ApiResponse {
  success: boolean;
  data: DealData[];
}

export default function DealsChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/top-cities`
        );
        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          const cities = result.data.map((item: DealData) => item.city);
          const dealCounts = result.data.map((item: DealData) => Number(item.deal_count));

          const maxValue = Math.max(...dealCounts);
          const colors = dealCounts.map((value: number) => {
            const intensity = maxValue > 0 ? value / maxValue : 0;
            const hue = 220 - intensity * 60;
            return {
              bg: `hsla(${hue}, 70%, 60%, 0.8)`,
              border: `hsla(${hue}, 70%, 50%, 1)`,
              hover: `hsla(${hue}, 70%, 70%, 0.9)`
            };
          });

          setChartData({
            labels: cities,
            datasets: [
              {
                label: "Deal Volume",
                data: dealCounts,
                backgroundColor: colors.map(c => c.bg),
                borderColor: colors.map(c => c.border),
                hoverBackgroundColor: colors.map(c => c.hover),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
              },
            ],
          });
        } else {
          setError("Failed to load data");
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
        setError("Unable to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            return `${context.parsed.y.toLocaleString()} deals`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500',
          },
          maxRotation: 45,
          minRotation: 0,
        },
        border: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
          callback: function (value: number) {
            return value.toLocaleString();
          }
        },
        border: {
          display: false,
        }
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    }
  };

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Unable to Load Data</h3>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Deal Distribution
            </h2>
            <p className="text-slate-300 text-sm">
              Performance across top markets
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Live Data</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150" style={{ animationDelay: '0.15s' }}></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading chart data...</p>
            <p className="text-sm text-slate-400">Fetching latest analytics</p>
          </div>
        ) : chartData ? (
          <>
            <div className="h-96 mb-6">
              <Bar data={chartData} options={options} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {chartData.labels.length}
                </div>
                <div className="text-sm text-slate-500 font-medium">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {chartData.datasets[0].data.reduce((a: number, b: number) => a + b, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 font-medium">Total Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">
                  {Math.max(...chartData.datasets[0].data).toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 font-medium">Highest Volume</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Available</h3>
              <p className="text-slate-500">Chart will appear when data is loaded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
