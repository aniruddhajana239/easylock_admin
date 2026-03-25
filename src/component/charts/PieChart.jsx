import Chart from "react-apexcharts";

const PieChart = () => {
  const options = {
    labels: ["Marketing", "Sales", "Development", "Customer Support"],
    colors: ["#6366f1", "#3b82f6", "#22c55e", "#f43f5e"],
    legend: {
      position: "bottom",
    },
  };

  const series = [25, 30, 15, 30]; // Represents percentages for each category

  return (
    <div className="w-full max-w-md mx-auto p-0 md:p-4">
      <h2 className="text-xl text-gray-800 font-bold text-center mb-4">
        Department Allocation
      </h2>
      <Chart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default PieChart;
