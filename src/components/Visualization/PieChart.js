// src/components/Visualizations/PieChart.js
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ genreData, title = "Genre Distribution" }) => {
  const colors = [
    '#1DB954', '#1ED760', '#FF6B35', '#FFB447', 
    '#6B5B95', '#88D8B0', '#FF8A80', '#82B1FF',
    '#69F0AE', '#FFD54F'
  ];

  const data = {
    labels: genreData.map(item => item.genre),
    datasets: [
      {
        data: genreData.map(item => item.count),
        backgroundColor: colors.slice(0, genreData.length),
        borderColor: colors.slice(0, genreData.length).map(color => color),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const genre = context.label;
            const count = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((count / total) * 100);
            return `${genre}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;