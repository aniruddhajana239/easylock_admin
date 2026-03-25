
import Chart from 'react-apexcharts';

const AreaChart = ({ salesData }) => {
  // Format date for display (show day-month)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Prepare data for the chart
  const prepareChartData = () => {
    if (!salesData || salesData.length === 0) {
      return {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        totalTokens: [0, 0, 0, 0, 0, 0],
        totalSoldTokens: [0, 0, 0, 0, 0, 0]
      };
    }

    // Sort data by date
    const sortedData = [...salesData].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    const categories = sortedData.map(item => formatDate(item.date));
    const totalTokens = sortedData.map(item => item.totalTokens || 0);
    const totalSoldTokens = sortedData.map(item => item.totalSeelledTokens || 0);

    return { categories, totalTokens, totalSoldTokens };
  };

  const { categories, totalTokens, totalSoldTokens } = prepareChartData();

  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories: categories,
      title: {
        text: 'Date',
        style: {
          fontSize: '12px',
          fontWeight: 600,
          color: '#374151'
        }
      },
      labels: {
        style: {
          fontSize: '11px',
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Token Count',
        style: {
          fontSize: '12px',
          fontWeight: 600,
          color: '#374151'
        }
      },
      labels: {
        style: {
          fontSize: '11px',
          colors: '#6B7280'
        }
      },
      min: 0
    },
    colors: ['#3B82F6', '#10B981'], // Blue for total tokens, Green for sold tokens
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 4,
      strokeWidth: 0,
      hover: {
        size: 6
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      padding: {
        top: 20,
        right: 20,
        bottom: 0,
        left: 20
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontWeight: 600,
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
      },
      x: {
        format: 'dd/MM/yyyy'
      },
      y: {
        formatter: function (val) {
          return val;
        }
      },
      custom: function({ series, dataPointIndex, w }) {
        const label = w.globals.labels[dataPointIndex];
        const totalTokens = series[0][dataPointIndex];
        const soldTokens = series[1][dataPointIndex];
        return `
          <div style="background: #1f2937; color: #ffffff; padding: 8px 12px; border-radius: 6px; font-size: 12px;">
            <div style="margin-bottom: 4px;"><strong>${label}</strong></div>
            <div style="color: #3B82F6;">Total Tokens: ${totalTokens}</div>
            <div style="color: #10B981;">Sold Tokens: ${soldTokens}</div>
          </div>
        `;
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  const series = [
    {
      name: 'Total Tokens',
      data: totalTokens
    },
    {
      name: 'Sold Tokens',
      data: totalSoldTokens
    }
  ];

  return (
    <div className="w-full">
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={350} 
      />
    </div>
  );
};

export default AreaChart;