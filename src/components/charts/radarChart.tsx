import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { WhiskyRadarChartProps } from "@/types/types";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ data }: WhiskyRadarChartProps) {
  const options = {
    responsive: true,
    scale: {
      ticks: { beginAtZero: true, max: 50 }, // 스케일 시작값 0, 최대값 100으로 설정
      min: 0, // 최소값을 0으로 설정
      max: 100, // 최대값을 100으로 설정
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // 범례 위치를 상단으로 설정
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <Radar data={data} options={options} />
    </div>
  );
}
