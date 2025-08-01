'use client';
import { useEffect, useState } from "react";

export default function ApiHealth() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/health`);
        const data = await res.json();
        setHealth(data);
      } catch (error) {
        setHealth({ status: "DOWN", service: "EzyRes Analytics API" });
      }
    };
    fetchHealth();
  }, []);

  if (!health) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-gray-600">Checking...</span>
      </div>
    );
  }

  const isHealthy = health.status === "OK";

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isHealthy 
        ? "bg-green-50 text-green-700 border border-green-200" 
        : "bg-red-50 text-red-700 border border-red-200"
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isHealthy 
          ? "bg-green-500 animate-pulse" 
          : "bg-red-500"
      }`}></div>
      <span>API {isHealthy ? "Healthy" : "Down"}</span>
    </div>
  );
}