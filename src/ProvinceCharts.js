import React from 'react';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import './dashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProvinceCharts = ({
  selectedProvince,
  provCreditScoreData,
  provTotalAmountData,
  provCreditCategoryData,
  provPaymenStatusData
}) => {

  
  if (!provCreditCategoryData) {
    return null; // or render a loading state
 }
  console.log('provCreditCategoryData:', provCreditCategoryData);


  return (
    <>
   
      {/* Pie Chart for Credit Category Distribution */}
      <div className="chart-container">
      <h2 className='chart-heading'> What is the distribution of credit Category among health facilities in {selectedProvince} ? </h2>
        <div className="center">
          <PieChart width={700} height={400}>
            <Pie
              data={provCreditCategoryData}
              cx={350}
              cy={200}
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {provCreditCategoryData?.map((entry, index) => (
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
      <h2 clclassName='chart-heading'> What is the distribution of payment status for Health Facilities in {selectedProvince}? </h2>
        <div className="center">
          <PieChart width={700} height={400}>
            <Pie
              data={provPaymenStatusData}
              cx={350}
              cy={200}
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {provPaymenStatusData?.map((entry, index) => (
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

   {/* Credit Score Bar Chart */}
   <div className="chart-container">
        <h2> What are the top three health facilities in {selectedProvince} based on the credit score?
</h2>
        <div className="center">
          <ResponsiveContainer width="90%" height={400} >
            <ComposedChart data={provCreditScoreData}>
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
              <Bar dataKey="creditScore" fill="#82ca9d" name="Credit Score" barSize={120}  />
              <Line type="monotone"  dataKey="creditScore" fill="#82ca9d" name="Credit Score" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Total Amount Bar Chart */}
      <div className="chart-container">
        <h2> What are the top three health facilities in  {selectedProvince} based on the highest total amount paid? </h2>
        <div className="center">
          <ResponsiveContainer width="90%" height={400} >
            <ComposedChart data={provTotalAmountData}>
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
              <Line type="monotone"  dataKey="totalAmount" fill="#8884d8" name="Total Amount" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      
    </>
  );
};

export default ProvinceCharts;
