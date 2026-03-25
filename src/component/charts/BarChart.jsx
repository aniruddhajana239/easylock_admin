import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const options = {
        chart: {
          type: 'bar',
          height: 350,
        },
        xaxis: {
          categories: ['Product A', 'Product B', 'Product C', 'Product D'],
        },
        colors: ['#f59e0b'],
      };

      const series = [
        {
          name: 'Sales',
          data: [120, 200, 150, 80],
        },
      ];

      chartInstance.current = new ApexCharts(chartRef.current, {
        ...options,
        series,
      });

      chartInstance.current.render();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-0 md:p-4">
      <h2 className="text-xl text-gray-800  font-bold text-center mb-4">Product Sales</h2>
      <div ref={chartRef}></div>
    </div>
  );
};

export default BarChart;
