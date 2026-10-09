import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SeriesChart({ data, unit }: { data: { label: string; value: number }[]; unit: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-72 rounded-xl bg-pumice" />;
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e4e8e3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#384451", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#384451", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ fill: "#f1f3f0" }}
            contentStyle={{ borderRadius: 12, borderColor: "#d9ded8", fontSize: 13 }}
            formatter={(value) => [`${value} ${unit}`, "Value"]}
          />
          <Bar dataKey="value" fill="#2f5583" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
