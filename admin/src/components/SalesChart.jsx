import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/analytics');
        const data = await res.json();

        const areas = data.map((item) => item.area);
        const sales = data.map((item) => item.total_sales);

        setChartData({
          labels: areas,
          datasets: [
            {
              label: 'Total Sales (₹)',
              data: sales,
              // 🌈 NEW: Different Colors for each Bar
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Red
                'rgba(54, 162, 235, 0.6)', // Blue
                'rgba(255, 206, 86, 0.6)', // Yellow
                'rgba(75, 192, 192, 0.6)', // Teal
                'rgba(153, 102, 255, 0.6)', // Purple
                'rgba(255, 159, 64, 0.6)', // Orange
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching graph data:", err);
      }
    };

    fetchSalesData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hides the box at the top since colors explain it
      },
      title: {
        display: true,
        text: 'Sales Performance by Area (Surat)',
        font: {
            size: 18
        }
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default SalesChart;