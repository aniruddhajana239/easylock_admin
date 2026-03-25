
import Chart from 'react-apexcharts';

const DashboardCharts = () => {
  // Chart configuration options
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    colors: ['#3b82f6'], // Primary color for the line
    markers: {
      size: 5,
    },
    tooltip: {
      enabled: true,
    },
  };

  // Data for the chart
  const chartSeries = [
    {
      name: 'Earnings',
      data: [50, 150, 80, 200, 170, 300], // Sample data
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-0 md:p-4">
      <h2 className="text-xl  text-gray-800  font-bold text-center mb-4">Monthly Earnings</h2>
      <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
    </div>
  );
};

export default DashboardCharts;
