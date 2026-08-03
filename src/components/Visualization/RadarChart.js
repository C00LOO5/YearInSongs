// src/components/Visualizations/RadarChart.js
import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ moodProfile, title = "Audio Features Profile" }) => {
  const data = {
    labels: [
      'Danceability',
      'Energy',
      'Valence',
      'Acousticness',
      'Instrumentalness',
      'Speechiness',
    ],
    datasets: [
      {
        label: 'Your Music Profile',
        data: [
          moodProfile.danceability,
          moodProfile.energy,
          moodProfile.valence,
          moodProfile.acousticness,
          moodProfile.instrumentalness,
          moodProfile.speechiness,
        ],
        backgroundColor: 'rgba(29, 185, 84, 0.2)',
        borderColor: 'rgba(29, 185, 84, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(29, 185, 84, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(29, 185, 84, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
      },
    },
    scales: {
      r: {
        angleLines: {
          color: '#404040',
        },
        grid: {
          color: '#404040',
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#888888',
          backdropColor: 'transparent',
        },
        min: 0,
        max: 1,
      },
    },
  };

  return (
    <div className="radar-chart-container">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;