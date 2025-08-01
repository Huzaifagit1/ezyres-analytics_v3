"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

// Define interfaces for trend data and summaries
interface TrendDataItem {
  label: string;
  count: number | string;
}

interface TrendSummary {
  total_properties?: number;
  avg_per_month?: number;
  avg_per_week?: number;
  avg_per_day?: number;
}

interface TrendResponse {
  data: TrendDataItem[];
  summary: TrendSummary;
}

export default function TrendsCards() {
  const [monthly, setMonthly] = useState<TrendResponse>({ data: [], summary: {} });
  const [weekly, setWeekly] = useState<TrendResponse>({ data: [], summary: {} });
  const [daily, setDaily] = useState<TrendResponse>({ data: [], summary: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const [monthlyRes, weeklyRes, dailyRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/monthly-trends`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/weekly-trends`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/daily-trends`),
        ]);

        const [monthlyData, weeklyData, dailyData]: TrendResponse[] = await Promise.all([
          monthlyRes.json(),
          weeklyRes.json(),
          dailyRes.json(),
        ]);

        setMonthly({ data: monthlyData.data || [], summary: monthlyData.summary || {} });
        setWeekly({ data: weeklyData.data || [], summary: weeklyData.summary || {} });
        setDaily({ data: dailyData.data || [], summary: dailyData.summary || {} });
      } catch (err) {
        console.error("Error fetching trends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Strongly type createChartData
  const createChartData = (data: TrendDataItem[], color: string): ChartData<"line"> => ({
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => Number(d.count)),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  });

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  if (loading) {
    return <p className="text-center text-slate-500 py-10">Loading trends...</p>;
  }

  const cards = [
    { title: "Monthly Trends", color: "#3b82f6", trend: monthly },
    { title: "Weekly Trends", color: "#22c55e", trend: weekly },
    { title: "Daily Trends", color: "#ef4444", trend: daily },
  ];

  return (
    <div className="w-full max-w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const total = card.trend.summary.total_properties || 0;
          const avg =
            card.trend.summary.avg_per_month ||
            card.trend.summary.avg_per_week ||
            card.trend.summary.avg_per_day ||
            0;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 flex flex-col justify-between min-w-[250px]"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-slate-700 font-semibold text-sm md:text-base">{card.title}</h4>
                <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-1">
                  {card.title.includes("Monthly")
                    ? "12 months"
                    : card.title.includes("Weekly")
                    ? "12 weeks"
                    : "30 days"}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 truncate">{total}</h2>
              <p className="text-xs md:text-sm text-slate-500">Avg: {avg}</p>

              <div className="h-16 md:h-20 mt-3">
                <Line data={createChartData(card.trend.data, card.color)} options={chartOptions} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
