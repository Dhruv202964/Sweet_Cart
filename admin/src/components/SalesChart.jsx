import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [allData, setAllData] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Surat');
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/analytics');
        if (res.ok) {
          const data = await res.json();
          setAllData(data);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (allData.length === 0) return;

    const cityData = allData.filter(item => item.city === selectedCity);
    
    let barColor = '#8B1A1A'; // Surat - Red
    if (selectedCity === 'Ahmedabad') barColor = '#F4A460'; // Ahmedabad - Saffron
    if (selectedCity === 'Vadodara') barColor = '#4A90E2'; // Vadodara - Blue

    const fullLabels = cityData.map(item => item.area);
    
    // 🚀 THE MULTI-LINE TRICK: Split long addresses by comma so they stack on top of each other!
    const multiLineLabels = cityData.map(item => {
      if (!item.area) return '';
      if (item.area.includes(',')) {
        return item.area.split(',').map(str => str.trim()); // Turns into an array = new lines!
      }
      if (item.area.length > 15) {
        return item.area.match(/.{1,15}/g); // Splits by 15 characters if no commas exist
      }
      return item.area;
    });

    setChartData({
      labels: multiLineLabels, // 👈 X-Axis gets the neatly stacked multi-line array
      datasets: [
        {
          label: `Total Revenue (₹)`,
          data: cityData.map(item => item.revenue),
          backgroundColor: barColor,
          borderRadius: 8, 
          maxBarThickness: 70, 
          categoryPercentage: 0.5, 
          fullLabels: fullLabels, // 👈 Keep the full string safe for the hover tooltip!
        },
      ],
    });
  }, [allData, selectedCity]);

  const cities = ['Surat', 'Ahmedabad', 'Vadodara'];

  return (
    <div className="w-full">
      
      {/* Header & City Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Sales Performance</h3>
          <p className="text-sm text-gray-400">Revenue distribution by area</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                selectedCity === city 
                  ? 'bg-white text-brand-red shadow-sm border border-gray-200' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* The Chart Canvas */}
      <div className="h-[320px] w-full relative">
        {chartData.labels.length > 0 ? (
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#1F2937',
                  padding: 12,
                  titleFont: { size: 14 },
                  bodyFont: { size: 14, weight: 'bold' },
                  callbacks: {
                    title: (tooltipItems) => {
                      const index = tooltipItems[0].dataIndex;
                      return tooltipItems[0].dataset.fullLabels[index]; // Hover shows single line!
                    },
                    label: (context) => `₹${context.raw.toLocaleString()}`
                  }
                }
              },
              scales: {
                y: { 
                  beginAtZero: true, 
                  grid: { color: '#F3F4F6' },
                  border: { display: false },
                  ticks: { font: { weight: 'bold', color: '#9CA3AF' } }
                },
                x: { 
                  grid: { display: false },
                  border: { display: false },
                  ticks: { 
                    font: { weight: 'bold', color: '#6B7280' },
                    maxRotation: 0, // 👈 Force text to stay flat (horizontal)
                    minRotation: 0
                  }
                }
              }
            }} 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            No delivery data available for {selectedCity} yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;