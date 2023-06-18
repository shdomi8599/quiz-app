import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";

type Props = {
  distributionData: {
    x: number;
    y: number;
  }[];
};

const StatisticsChart = ({ distributionData }: Props) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let previousChart = useRef<Chart | null>(null);
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
                text: "정답률",
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

  return <Box><canvas ref={chartRef} /></Box>;
};
export default StatisticsChart;

const Box = styled.main``;
