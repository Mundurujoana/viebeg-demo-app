import React from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SectorCharts = ({ selectedSector, sectorCreditScoreData, sectorTotalAmountData, sectorCreditCategoryData, sectorPaymentStatusData }) => {
  return (
    <>
      {/* Credit Score Bar Chart */}
      <div className="chart-container">
        <h2 className='chart-heading'> {selectedSector} Top Three Customers with the Highest Credit Score</h2>
        <div className="center">
          <ResponsiveContainer width="90%" height={400}>
            <ComposedChart data={sectorCreditScoreData}>
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis
                dataKey="customerName"
                angle={-10}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ dy: 10, fontSize: 10 }}  // Adjust the fontSize as needed
                label={{ value: 'Health Facility', position: 'insideBottom', offset: 0 }}
              />
              <YAxis
                width={100}
                tick={{ dy: 10 }}
                label={{ value: 'Credit Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip cursor={false} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  marginTop: '-40px', // Adjust this value to move the legend up
                }}
              />
              <Bar dataKey="creditScore" fill="#82ca9d" name="Credit Score" barSize={120} />
              <Line type="monotone" dataKey="creditScore" fill="#82ca9d" name="Credit Score" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Total Amount Bar Chart */}
      <div className="chart-container">
        <h2 className='chart-heading'> {selectedSector} Top Three Customers with the Highest Total Amount</h2>
        <div className="center">
          <ResponsiveContainer width="90%" height={400}>
            <ComposedChart data={sectorTotalAmountData}>
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis
                dataKey="customerName"
                angle={-10}
                textAnchor="end"
                interval={0}
                height={80}
                tick={{ dy: 10, fontSize: 10 }}  // Adjust the fontSize as needed
                label={{ value: 'Health Facility', position: 'insideBottom', offset: 0 }}
              />
              <YAxis
                width={100}
                tick={{ dy: 10 }}
                label={{ value: 'Total Amount', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip cursor={false} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  marginTop: '-40px', // Adjust this value to move the legend up
                }}
              />
              <Bar dataKey="totalAmount" fill="#8884d8" name="Total Amount" barSize={120} />
              <Line type="monotone" dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart for Credit Category Distribution */}
      <div className="chart-container">
        <h2 className='chart-heading'>Credit Category Distribution</h2>
        <div className="center">
          <PieChart width={700} height={400}>
            <Pie
              data={sectorCreditCategoryData}
              cx={350}
              cy={200}
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {sectorCreditCategoryData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                marginTop: '-40px', // Adjust this value to move the legend up
              }}
            />
          </PieChart>
        </div>
      </div>

      {/* Pie Chart for Payment Status Distribution */}
      <div className="chart-container">
        <h2 className='chart-heading'>Payment Status Distribution</h2>
        <div className="center">
          <PieChart width={700} height={400}>
            <Pie
              data={sectorPaymentStatusData}
              cx={350}
              cy={200}
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {sectorPaymentStatusData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                marginTop: '-40px', // Adjust this value to move the legend up
              }}
            />
          </PieChart>
        </div>
      </div>
    </>
  );
};

export default SectorCharts;
