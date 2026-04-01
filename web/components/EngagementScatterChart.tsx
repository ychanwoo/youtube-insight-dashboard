"use client";

import {
  CartesianGrid,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

type ChartPoint = {
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number;
};

type Props = {
  data: ChartPoint[];
};

function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    payload: ChartPoint;
  }[];
};

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div className="max-w-65 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
      <p className="mb-3 wrap-break-word text-sm font-bold text-black">
        {item.title || "제목 없음"}
      </p>

      <div className="space-y-1 text-sm text-neutral-700">
        <p>조회수: {formatNumber(item.viewCount)}</p>
        <p>좋아요: {formatNumber(item.likeCount)}</p>
        <p>댓글수: {formatNumber(item.commentCount)}</p>
        <p>참여율: {item.engagementRate.toFixed(2)}%</p>
      </div>
    </div>
  );
}

export default function EngagementScatterChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-5 flex w-full flex-col">
        <div className="flex h-80 min-h-80 w-full items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
          최근 영상 데이터가 없습니다.
        </div>
      </div>
    );
  }

  const avgViewCount = Math.round(
    data.reduce((sum, item) => sum + item.viewCount, 0) / data.length,
  );

  const avgEngagementRate = Number(
    (
      data.reduce((sum, item) => sum + item.engagementRate, 0) / data.length
    ).toFixed(2),
  );

  const chartData = data.map((item) => ({
    ...item,
    title: item.title?.trim() || "제목 없음",
    zValue: Math.max(item.commentCount, 20),
  }));

  return (
    <div className="mt-5 w-full">
      <div className="w-full min-w-0 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-2">
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <ScatterChart margin={{ top: 20, right: 26, bottom: 20, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />

            <XAxis
              type="number"
              dataKey="viewCount"
              name="조회수"
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              tick={{ fontSize: 12, fill: "#737373" }}
              axisLine={{ stroke: "#d4d4d4" }}
              tickLine={{ stroke: "#d4d4d4" }}
            >
              <Label
                value="조회수"
                position="insideBottom"
                offset={-10}
                style={{ fill: "#737373", fontSize: 12 }}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="engagementRate"
              name="참여율"
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12, fill: "#737373" }}
              axisLine={{ stroke: "#d4d4d4" }}
              tickLine={{ stroke: "#d4d4d4" }}
              width={60}
            >
              <Label
                value="참여율 (%)"
                angle={-90}
                position="insideLeft"
                style={{ fill: "#737373", fontSize: 12 }}
              />
            </YAxis>

            <ZAxis type="number" dataKey="zValue" range={[80, 420]} />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: "4 4" }}
            />

            <ReferenceLine
              x={avgViewCount}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: `평균 조회수 (${formatNumber(avgViewCount)})`,
                position: "top",
                fill: "#ef4444",
                fontSize: 12,
              }}
            />

            <ReferenceLine
              y={avgEngagementRate}
              stroke="#f97316"
              strokeDasharray="4 4"
              label={{
                value: `평균 참여율 (${avgEngagementRate}%)`,
                position: "right",
                fill: "#f97316",
                fontSize: 12,
              }}
            />

            <Scatter data={chartData} fill="#dc2626" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 px-1 text-xs leading-5 text-neutral-500">
        참여율 = (좋아요 + 댓글) / 조회수 × 100
        <br />
        평균선보다 위에 있는 점일수록 팬 반응이 좋은 영상입니다.
      </p>
    </div>
  );
}
