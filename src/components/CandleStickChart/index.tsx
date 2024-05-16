import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
// import { chartData } from "./data";

const CandlestickChart = () => {
  const [chartData, setChartData] = useState<
    {
      x: Date;
      y: number[];
    }[]
  >([]);

  useEffect(() => {
    setChartData([]);
  }, []);

  // const handleGetData = useCallback(async () => {
  //   try {
  //     const { data } = await axios.get(
  //       "http://localhost:4000/api/v1/candles?from=1661740745&to=1693233759&ticker=0x9ba2d136287f6c522d9163b3f273f7a79ad254c0&resolution=1440&chainId=56"
  //     );

  //     const result = data.data.map((m: any) => {
  //       return {
  //         x: m.time,
  //         y: [m.open, m.high, m.low, m.close],
  //       };
  //     });
  //     setChartData(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   handleGetData();
  // }, [handleGetData]);
  // Sample data for the candlestick chart
  const series = [
    {
      data: chartData,
    },
  ];

  return (
    <div className="candlestick-chart">
      {chartData.length ? (
        <ReactApexChart
          options={{
            chart: {
              type: "candlestick",
            },
            xaxis: {
              type: "datetime",
            },
          }}
          series={series}
          type="candlestick"
          height={400}
        />
      ) : null}
    </div>
  );
};

export default CandlestickChart;
