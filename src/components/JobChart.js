// client/src/components/JobChart.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function JobChart({ data }) {
  return (
    <div className="mt-8 p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">📊 Match Score Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="title" type="category" />
          <Tooltip />
          <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default JobChart;
