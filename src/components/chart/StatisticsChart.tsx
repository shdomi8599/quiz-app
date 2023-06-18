import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";

type Props = {
  onFailRate: boolean;
  distributionData: {
    x: number;
    y: number;
  }[];
};

const StatisticsChart = ({ distributionData, onFailRate }: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let previousChart = useRef<Chart | null>(null);
  const xText = onFailRate ? "실패율" : "정답률";
  useEffect(() => {
    if (chartRef.current && distributionData) {
      if (previousChart.current) {
        previousChart.current.destroy();
      }

      Chart.register(...registerables);
      const ctx = chartRef.current;

      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "분포도",
              data: distributionData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: xText,
              },
              ticks: {
                stepSize: 10,
              },
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "데이터 수",
              },
            },
          },
        },
      });

      previousChart.current = newChart;
    }
  }, [distributionData]);

  return <canvas ref={chartRef} />;
};
export default StatisticsChart;
