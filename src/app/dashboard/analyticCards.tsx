"use client";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AvgArvItem {
  avg_arv: string;
  type: string;
}

interface SuccessRateItem {
  success_rate_percent: string;
  type: string;
}

interface AccessBreakdownItem {
  total: string;
  access: string;
}

type ChartItem = AvgArvItem | SuccessRateItem | AccessBreakdownItem;

export default function AnalyticsDonutCharts() {
  const [avgData, setAvgData] = useState<AvgArvItem[]>([]);
  const [successData, setSuccessData] = useState<SuccessRateItem[]>([]);
  const [accessData, setAccessData] = useState<AccessBreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [avgRes, successRes, accessRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/avg-by-type`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/success-rate`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics/access-breakdown`)
        ]);

        const [avgJson, successJson, accessJson] = await Promise.all([
          avgRes.json(),
          successRes.json(),
          accessRes.json()
        ]);

        setAvgData(avgJson.data || []);
        setSuccessData(successJson.data || []);
        setAccessData(accessJson.data || []);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
      borderColor: 'rgba(148, 163, 184, 0.3)',
      borderWidth: 1,
      cornerRadius: 12,
      displayColors: true,
      titleFont: { size: 13, },
      bodyFont: { size: 13,  },
      padding: 12,
      callbacks: {
        label: function (context) {
          const chart = context.chart;
          const dataset = chart.data.datasets[context.datasetIndex];
          const total = (dataset.data as number[]).reduce((sum, value) => sum + value, 0);
          const value = context.parsed;
          const percentage = ((value / total) * 100).toFixed(0);
          return `${context.label}: ${percentage}%`;
        },
        title: function () {
          return "";
        }
      }
    }
  },
  animation: {
    animateRotate: true,
    duration: 1000,
  }
};

  // Chart configurations
  const charts = [
    {
      id: 'avg-arv',
      title: 'Average ARV',
      data: avgData,
      getValue: (item: AvgArvItem) => parseFloat(item.avg_arv),
      getLabel: (item: AvgArvItem) => item.type,
      formatValue: (value: number) => `$${value.toLocaleString()}`,
      colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981']
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      data: successData,
      getValue: (item: SuccessRateItem) => parseFloat(item.success_rate_percent),
      getLabel: (item: SuccessRateItem) => item.type,
      formatValue: (value: number) => `${value}%`,
      colors: ['#22c55e', '#ef4444', '#f59e0b', '#06b6d4']
    },
    {
      id: 'access-breakdown',
      title: 'Access Types',
      data: accessData,
      getValue: (item: AccessBreakdownItem) => parseFloat(item.total),
      getLabel: (item: AccessBreakdownItem) => item.access,
      formatValue: (value: number) => value.toLocaleString(),
      colors: ['#f59e0b', '#06b6d4', '#8b5cf6', '#22c55e']
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-6 w-6 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-32 bg-slate-200 rounded-full mx-auto mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {charts.map((chart) => {
        type ChartDataType = typeof chart extends { id: 'avg-arv' }
          ? AvgArvItem
          : typeof chart extends { id: 'success-rate' }
          ? SuccessRateItem
          : AccessBreakdownItem;  

const chartItems: ChartItem[] = chart.data;

        const labels = chartItems.map((item) => {
          if ('avg_arv' in item) return (chart.getLabel as (i: AvgArvItem) => string)(item);
          if ('success_rate_percent' in item) return (chart.getLabel as (i: SuccessRateItem) => string)(item);
          return (chart.getLabel as (i: AccessBreakdownItem) => string)(item);
        });

        const data = chartItems.map((item) => {
          if ('avg_arv' in item) return (chart.getValue as (i: AvgArvItem) => number)(item);
          if ('success_rate_percent' in item) return (chart.getValue as (i: SuccessRateItem) => number)(item);
          return (chart.getValue as (i: AccessBreakdownItem) => number)(item);
        });

        const chartData = {
          labels,
          datasets: [{
            data,
            backgroundColor: chart.colors.slice(0, chartItems.length),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverOffset: 8,
          }]
        };

        const totalValue = data.reduce((sum, val) => sum + val, 0);
        const hasData = chartItems.length > 0;

        return (
          <div key={chart.id} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{chart.title}</h3>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {hasData ? (
                <>
                  <div className="relative h-48 mb-4">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs text-slate-500 font-medium">Total</span>
                      <span className="text-lg font-bold text-slate-800">
                        {chart.formatValue(totalValue)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {chartItems.map((item, idx) => {
                      const value = data[idx];
                      const percentage = ((value / totalValue) * 100).toFixed(1);
                      const label = labels[idx];

                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: chart.colors[idx] }}
                            ></div>
                            <span className="text-slate-600 font-medium truncate">
                              {label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-slate-500 font-medium">
                              {percentage}%
                            </span>
                            <span className="text-slate-800 font-semibold">
                              {chart.formatValue(value)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">No data available</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
