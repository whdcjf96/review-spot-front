"use client";

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

// ChartJS에 필요한 컴포넌트들을 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  max: number;
}

export default function BarChart({ data, max }: BarChartProps) {
  const options = {
    indexAxis: "y" as const, // 가로 방향 막대를 설정
    plugins: {
      legend: {
        display: false, // 범례 숨김
      },
    },
    scales: {
      x: {
        stacked: true, // X축 쌓인 막대
        beginAtZero: true, // X축이 0부터 시작하도록 설정
        max: max, // X축의 최대값 설정
        ticks: {
          stepSize: 20, // 10단위로 눈금 표시
        },
      },
      y: {
        stacked: true, // Y축 쌓인 막대
      },
    },
    maintainAspectRatio: true, // 차트의 종횡비를 유지
  };

  return <Bar data={data} options={options} />;
}
