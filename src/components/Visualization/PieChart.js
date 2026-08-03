// src/components/Visualization/PieChart.js
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ genreData }) => {
  // A more premium, vibrant color palette for dark mode
  const colors = [
    '#1DB954', '#9B59B6', '#3498DB', '#E74C3C',
    '#F1C40F', '#1ABC9C', '#E67E22', '#34495E',
    '#D35400', '#2ECC71'
  ];

  const data = {
    labels: genreData.map(item => item.genre),
    datasets: [
      {
        data: genreData.map(item => item.count),
        backgroundColor: colors.slice(0, genreData.length),
        // Use the dark surface color as the border to create a "gap" between slices
        borderColor: '#262828',
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // Turns the pie into a sleek doughnut
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 33, 33, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#a7a9a9',
        borderColor: 'rgba(119, 124, 124, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const genre = context.label;
            const count = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((count / total) * 100);
            return ` ${percentage}% (${count} artists)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PieChart;
