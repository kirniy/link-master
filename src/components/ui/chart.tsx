import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

export function Chart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
}
