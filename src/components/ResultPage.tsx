"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ResultsPage() {
  const [formData, setFormData] = useState<
    | {
        [key: string]: [number, number]; 
      }
    | null
  >(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("formData");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  if (!formData) return <p className="text-center text-gray-400">No data submitted</p>;

  
  const chartData = Object.keys(formData).map((key) => ({
    model: key,
    probalility: Math.round(formData[key][1] * 100), 
    placed: formData[key][0] === 1 ? "Yes" : "No",
  }));

  
  const averageprobalility =
    chartData.reduce((acc, cur) => acc + cur.probalility, 0) / chartData.length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4 border-b-2 border-white pb-2">Submission Results</h1>

      
      <div className="w-full max-w-3xl bg-gray-900 p-4 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="model" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ backgroundColor: "black", color: "white" }} />
            <Bar dataKey="probalility" fill="white" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
      <div className="mt-6 w-full max-w-3xl">
        <table className="w-full border border-white text-center">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-white p-2">Model</th>
              <th className="border border-white p-2">Placed</th>
              <th className="border border-white p-2">probalility (%)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.model} className="border-b border-white">
                <td className="p-2">{item.model}</td>
                <td className="p-2">{item.placed}</td>
                <td className="p-2">{item.probalility}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-6 text-lg bg-gray-800 p-4 rounded-lg shadow-md">
        <p className="font-semibold">
          <span className="text-gray-300">Average probalility:</span> {averageprobalility.toFixed(2)}%
        </p>
      </div> */}

      <Link href="/" className="w-96 m-10">
            <Button className="w-full bg-white text-black" variant="link">
              Back
            </Button>
      </Link>
    </div>
  );
}
