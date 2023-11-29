// Dashboard.js
import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate,  Link  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


import './dashboard.css';

const Dashboard = () => {

          
  const [customerNames, setCustomerNames] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(''); // Initialize currencySymbol state
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState([]); // Add districts state
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtCreditScore, setDistrictCreditScore] = useState(null);
  const [creditScores, setCreditScores] = useState(null); // Add creditScores state
const [districtCounts, setDistrictCounts] = useState([]);
const [districtOccurrences, setDistrictOccurrences] = useState([]);
const navigate = useNavigate(); // Get access to the navigate function
const [selectedContent, setSelectedContent] = useState('default');
const [isDistrictSubmitted, setIsDistrictSubmitted] = useState(false);

const [isDistrictLoading, setIsDistrictLoading] = useState(false);



const apiUrl = 'https://viebeg-server.onrender.com';

useEffect(() => {
  const fetchDistricts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/districts');
      const data = await response.json();
      setDistrictOccurrences(data);
    } catch (error) {
      console.error('Error fetching district data:', error);
    }
  };

  fetchDistricts();
}, []);





const handleDistrictSelectChange = async (e) => {
          const district = e.target.value;
          setSelectedDistrict(district);
          setIsDistrictSubmitted(false);
        
          // Reset district credit score when selecting a new district
          setDistrictCreditScore(null);
        
          // No need to fetch district credit score here, it will be fetched on form submit
        };
        
        const handleDistrictSubmit = async (e) => {
          e.preventDefault();
        
          try {
            // Fetch credit score for the selected district
            await fetchDistrictCreditScore(selectedDistrict);
          } catch (error) {
            console.error('Error fetching district credit score:', error);
          } finally {
            setIsSubmitted(true); // Set isSubmitted to true when the form is submitted
          }
        };
        
        
        




// Other functions...

const fetchDistrictCreditScore = async () => {
          try {
            setIsDistrictLoading(true);
        
            const response = await fetch(`${apiUrl}/api/customers?district=${selectedDistrict}`);
            const data = await response.json();
        
            if (data && data.length > 0) {
              const customersWithSelectedDistrict = data.filter((customer) => customer.location_district === selectedDistrict);
        
              if (customersWithSelectedDistrict.length > 0) {
                const creditScorePromises = customersWithSelectedDistrict.map(async (selectedCustomerData) => {
                  const custId = selectedCustomerData.cust_id;
                  const creditScoreResponse = await fetch(`${apiUrl}/api/customers/${custId}/creditScore`);
                  const creditScoreData = await creditScoreResponse.json();
        
                  return {
                    customerName: selectedCustomerData.customer_name,
                    ...creditScoreData,
                  };
                });
        
                const fetchedCreditScores = await Promise.all(creditScorePromises);
        
                setDistrictCreditScore(fetchedCreditScores);
                setIsDistrictSubmitted(true);
              } else {
                console.error('No customers found for the specified district.');
              }
            } else {
              console.error('No customers found for the specified district.');
            }
        
            setIsDistrictLoading(false);
          } catch (error) {
            setIsDistrictLoading(false);
            console.error('Error fetching customer data:', error);
          }
        };
        
        


useEffect(() => {
  const fetchCustomerNames = async () => {
    try {
      setIsLoading(true); // Set isLoading to true before fetching data

      const response = await fetch(`${apiUrl}/api/customers`);
      const data = await response?.json();
      setCustomerNames(data.map((customer) => customer.customer_name));
    } catch (error) {
      console.error('Error fetching customer names:', error);
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching data
    }
  };

  fetchCustomerNames();
}, []);





const handleSelectChange = async (e) => {
  const customerName = e.target.value;
  setSelectedCustomer(customerName);
  setIsSubmitted(false);

  try {
    const response = await fetch(`${apiUrl}/api/customers?name=${customerName}`);

    const data = await response.json();

    if (data && data.length > 0) {
      const selectedCustomerData = data.find((customer) => customer.customer_name === customerName);

      if (selectedCustomerData) {
        const custId = selectedCustomerData.cust_id;

        const creditScoreResponse = await fetch(`${apiUrl}/api/customers/${custId}/creditScore`);

        const creditScoreData = await creditScoreResponse.json();

        // Fetch transaction data for the selected customer
        const transactionsResponse = await fetch(`${apiUrl}/api/customers/${custId}/transactions`);

        const transactionsData = await transactionsResponse.json();

        

        // Set both credit score and transaction info separately
        setCustomerData(selectedCustomerData);
        setCustomerInfo(creditScoreData);
        setTransactionInfo(transactionsData);
        if (transactionsData.length > 0) {
          // Get the currency from the first transaction in transactionsData
          setCurrencySymbol(transactionsData[0].currency);
        } else {
          console.error('No transactions found for the selected customer:', customerName);
        }          
        console.log('cureeeeeeeeeee', currencySymbol)

      } else {
        console.error('No matching customer found for the selected name:', customerName);
      }
    } else {
      console.error('No data retrieved for the selected customer name:', customerName);
    }
  } catch (error) {
    console.error('Error fetching customer information:', error);
  }
};




const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitted(true);
};

const sortedTransactionInfo = Array.isArray(transactionInfo)
? [...transactionInfo].sort((a, b) => a.total_amount - b.total_amount)
: [];

const formatDate = (date) => {
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
return new Date(date).toLocaleDateString('en-US', options);
};




// Function to fetch district names from the server
const fetchDistrictsName = async () => {
try {
  const response = await fetch('http://localhost:5000/api/districts-names'); // Update the URL
  const data = await response.json();
  setDistricts(data);
} catch (error) {
  console.error('Error fetching district data:', error);
}
};

// Call the fetchDistricts function when the component mounts
useEffect(() => {
fetchDistrictsName();
}, []);


const handleShowSidebar = () => {
          setIsSubmitted(false);
        };


          const handleContentChange = (content) => {
            setSelectedContent(content);
            setIsSubmitted(false);
          };
        

          
          // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
const COLORS = [
          '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
          '#FF6F61', '#6B4226', '#E63946', '#F1FAEE', '#A8DADC',
          '#457B9D', '#1D3557', '#F4A261', '#2A9D8F', '#D7263D',
          '#F4A261', '#D36582', '#F28482', '#FAD02E', '#6A0572',
        ];
        
        // ...
        
        
        
        const getPaymentMethodData = () => {
          if (transactionInfo) {
            const paymentMethods = {};
        
            transactionInfo.forEach((transaction) => {
              const paymentMethod = transaction.payment_method || 'Did Not Pay';
              if (paymentMethod in paymentMethods) {
                paymentMethods[paymentMethod] += 1;
              } else {
                paymentMethods[paymentMethod] = 1;
              }
            });
        
            return Object.keys(paymentMethods).map((method) => ({
              name: method,
              value: paymentMethods[method],
            }));
          }
          return [];
        };
        
        // const getPaymentStatusData = () => {
        //   if (transactionInfo) {
        //     const paymentStatuses = {};
        
        //     transactionInfo.forEach((transaction) => {
        //       const paymentStatus = transaction.payment_status || 'Did Not Pay';
        //       if (paymentStatus in paymentStatuses) {
        //         paymentStatuses[paymentStatus] += 1;
        //       } else {
        //         paymentStatuses[paymentStatus] = 1;
        //       }
        //     });
        
        //     return Object.keys(paymentStatuses).map((status) => ({
        //       name: status,
        //       value: paymentStatuses[status],
        //     }));
        //   }
        //   return [];
        // };
        
        const getPaymentStatusData = () => {
          if (transactionInfo) {
            const paymentStatuses = {};
        
            transactionInfo.forEach((transaction) => {
              let paymentStatus = transaction.payment_status || 'Not Paid';
              // Capitalize the first letter of each word
              paymentStatus = paymentStatus.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        
              if (paymentStatus in paymentStatuses) {
                paymentStatuses[paymentStatus] += 1;
              } else {
                paymentStatuses[paymentStatus] = 1;
              }
            });
        
            return Object.keys(paymentStatuses).map((status) => ({
              name: status,
              value: paymentStatuses[status],
            }));
          }
          return [];
        };
        
        
        const getCurrencyData = () => {
          if (transactionInfo) {
            const currencies = {};
        
            transactionInfo.forEach((transaction) => {
              let currency = transaction.currency || 'Unknown Currency';
              // Capitalize the first letter of each word
              currency = currency.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
              if (currency in currencies) {
                currencies[currency] += 1;
              } else {
                currencies[currency] = 1;
              }
            });
        
            return Object.keys(currencies).map((currency) => ({
              name: currency,
              value: currencies[currency],
            }));
          }
          return [];
        };
        
        
        const getDelayDaysData = () => {
          if (transactionInfo) {
            const delayDaysData = {};
        
            transactionInfo.forEach((transaction) => {
              const delayDays = transaction.delay_days;
        
              if (delayDays === null) {
                if ("MissedPayments" in delayDaysData) {
                  delayDaysData.MissedPayments += 1;
                } else {
                  delayDaysData.MissedPayments = 1;
                }
              } else if (delayDays > 0) {
                if ("LatePayments" in delayDaysData) {
                  delayDaysData.LatePayments += 1;
                } else {
                  delayDaysData.LatePayments = 1;
                }
              } else if (delayDays < 0) {
                if ("EarlyPayments" in delayDaysData) {
                  delayDaysData.EarlyPayments += 1;
                } else {
                  delayDaysData.EarlyPayments = 1;
                }
              } else {
                if ("TimelyPayments" in delayDaysData) {
                  delayDaysData.TimelyPayments += 1;
                } else {
                  delayDaysData.TimelyPayments = 1;
                }
              }
            });
        
            return Object.keys(delayDaysData).map((status) => ({
              name: status,
              value: delayDaysData[status],
            }));
          }
          return [];
        };
        
        function capitalizeEveryWord(text) {
          return text
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }
        
        
        const groupDataByYear = (data) => {
          const groupedData = {};
        
          data.forEach((transaction) => {
            const year = new Date(transaction.date_of_payment).getFullYear();
            const totalAmount = parseFloat(transaction.total_amount);
        
            if (isNaN(totalAmount)) {
              if (!groupedData[year]) {
                groupedData[year] = 0;
              }
            } else {
              if (!groupedData[year]) {
                groupedData[year] = 0;
              }
              groupedData[year] += totalAmount;
            }
          });
        
          // Convert the grouped data to an array of objects
          return Object.keys(groupedData).map((year) => ({
            year,
            total_amount: groupedData[year],
          }));
        };
        
        const groupDataByYearAndPaymentStatus = (data) => {
          const groupedData = {};
        
          data.forEach((transaction) => {
            const year = new Date(transaction.date_of_payment).getFullYear();
            const totalAmount = parseFloat(transaction.total_amount);
            let paymentStatus;
        
            const delayDays = transaction.delay_days;
            if (delayDays === null) {
              paymentStatus = 'MissedPayments';
            } else if (delayDays > 0) {
              paymentStatus = 'LatePayments';
            } else if (delayDays < 0) {
              paymentStatus = 'EarlyPayments';
            } else {
              paymentStatus = 'TimelyPayments';
            }
        
            if (!(year in groupedData)) {
              groupedData[year] = {
                MissedPayments: 0,
                LatePayments: 0,
                EarlyPayments: 0,
                TimelyPayments: 0,
              };
            }
        
            groupedData[year][paymentStatus] += totalAmount;
          });
        
          // Convert the grouped data to an array of objects
          return Object.keys(groupedData).map((year) => ({
            year,
            MissedPayments: groupedData[year].MissedPayments,
            LatePayments: groupedData[year].LatePayments,
            EarlyPayments: groupedData[year].EarlyPayments,
            TimelyPayments: groupedData[year].TimelyPayments,
          }));
        };
        
         
          return (
            <div className={`dashboard ${isSubmitted ? 'without-sidebar' : 'with-sidebar'}`}>
              <div className="sidebar">
                <h2 onClick={() => handleContentChange('healthFacility')}>Health Facility</h2>
                <h2 onClick={() => handleContentChange('regions')}>Regions</h2>
              </div>
              <div className="content">
              {isSubmitted && (
            <div className="show-sidebar" onClick={handleShowSidebar}>
            <FontAwesomeIcon icon={faArrowLeft} /> Show Sidebar
          </div>
          )}

            {selectedContent === 'default' && (
          <div>
            
            <h2>Welcome to Viebeg :  </h2>
            <h2>Health Assessment and Capacity Evaluation Tool (HACET)</h2>
            {/* Default content goes here */}
          </div>
        )}
                {selectedContent === 'healthFacility' && (
                  <div>
      
      <div className="customer-list-container">
           {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
        <>
  
  {/* <div>
        <h2>District Occurrences</h2>
        <ul>
          {Object.entries(districtOccurrences).map(([district, occurrences]) => (
            <li key={district}>
              {district}: {occurrences} occurrences
            </li>
          ))}
        </ul>
      </div> */}
  
        <h2>Health Facilities</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select a facility:</label>
            <select value={selectedCustomer} onChange={handleSelectChange}>
              <option value="">Select a Health Facility </option>
              {customerNames.sort().map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
  
  

        
  
        {/* Display customers and credit score information */}
        {selectedDistrict && isSubmitted && creditScores && (
          <div className="credit-score-table">
            <h2>Customers in {selectedDistrict} with Credit Score Information</h2>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Total Amount</th>
                  <th>Amount Paid</th>
                  <th>Delay Days</th>
                  <th>Credit Score</th>
            <th>Payment Ratio</th>
            <th>Credit Category</th>
            <th>Amount Owed</th>
            <th>Missed Payments</th>
            <th>Number of Transactions</th>
                          </tr>
              </thead>
              <tbody>
                {creditScores.map((score, index) => (
                  <tr key={index}>
                    <td>{score.customerName}</td>
                    <td>{score.total_amount}</td>
                    <td>{score.amount_paid}</td>
                    <td>{score.delay_days}</td>
                    <td>{score.credit_score}</td>
              <td>{score.payment_ratio}</td>
              <td>{score.credit_category}</td>
              <td>{score.amount_owed}</td>
              <td>{score.missed_payments}</td>
              <td>{score.number_of_transactions}</td>
                    {/* Add other credit score details as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  
  
       
       
        {selectedCustomer && isSubmitted && customerData && (
          <div className="customer-info">
            <h2>{selectedCustomer} Location Information</h2>
            <p>Location Country: {customerData.location_country}</p>
            <p>Location Province: {customerData.location_province}</p>
            <p>Location District: {customerData.location_district}</p>
            <p>Location Sector: {customerData.location_sector}</p>
            <p>Sector ID: {customerData.sector_id}</p>
            <p>Type: {customerData.type}</p>
          </div>
        )}
  
        {selectedCustomer && isSubmitted && customerInfo && (
          <div className="customer-info">
            <h2>{selectedCustomer} CreditScore Information</h2>
            <p>Facility Name: {selectedCustomer}</p>
            <p>Credit category: {customerInfo.credit_category}</p>
            <p>Amount owed: {customerInfo.amount_owed}</p>
            <p>Missed payments: {customerInfo.missed_payments}</p>
            <p>amount Paid: {customerInfo.amount_paid}</p>
            <p>Total Amount: {customerInfo.total_amount}</p>
            <p>delay Days: {customerInfo.delay_days}</p>
            <p>Credit Score: {customerInfo.credit_score}</p>
            <p>Payment_ratio: {customerInfo.payment_ratio}</p>
            <p>Number of Transactions: {customerInfo.number_of_transactions}</p>
          </div>
        )}
  
  
  
  {selectedCustomer && isSubmitted && transactionInfo && (
    <div className="customer-info">
      <h2>{selectedCustomer} Transaction Information</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Order ID</th>
            <th>Date Requested</th>
            <th>Date Invoice</th>
            <th>Due Date</th>
            <th>Delay Days</th>
            <th>Date Payment</th>
            <th>Total Amount</th>
            <th>Amount Paid</th>
            <th>Balance</th>
            <th>Payment Method</th>
            <th>Currency</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {transactionInfo.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.transaction_id}</td>
              <td>{transaction.order_id}</td>
              <td>{formatDate(transaction.date_requested)}</td>
              <td>{formatDate(transaction.date_invoice)}</td>
              <td>{formatDate(transaction.due_date)}</td>
              <td>{transaction.delay_days}</td>
              <td>{formatDate(transaction.date_of_payment)}</td>
              <td>{transaction.total_amount}</td>
              <td>{transaction.amount_paid}</td>
              <td>{transaction.balance}</td>
              <td>{transaction.payment_method}</td>
              <td>{transaction.currency}</td>
              <td>{transaction.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
        <h2>What is the payment Method distribution for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
    <PieChart width={700} height={400}>
      <Pie
        data={getPaymentMethodData()}
        cx={350}
        cy={200}
        labelLine={false}
        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {getPaymentMethodData().map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            marginTop: '-40px', // Adjust this value to move the legend up
          }}
        />    </PieChart>
  </div>
  </div>
)}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2> What is the payment status distribution for {capitalizeEveryWord(selectedCustomer)}? </h2>
    <div className="center">
    <PieChart width={700} height={400}>
      <Pie
        data={getPaymentStatusData()}
        cx={350}
        cy={200}
        labelLine={false}
        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {getPaymentStatusData().map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            marginTop: '-40px', // Adjust this value to move the legend up
          }}
        />    </PieChart>
  </div>
  </div>
)}




 {selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>Which Currency is commonly used for transactions at {capitalizeEveryWord(selectedCustomer)} ?</h2>
    <div className="center">
    <PieChart width={700} height={400}>
      <Pie
        data={getCurrencyData()}
        cx={350}
        cy={200}
        labelLine={false}
        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(2)}%`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {getCurrencyData().map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
      </Pie>
      <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            marginTop: '-40px', // Adjust this value to move the legend up
          }}
        />    </PieChart>
  </div>
  </div>
)}




{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>What is the Distribution of Payment for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
      <PieChart width={700} height={400}>
        <Pie
          data={getDelayDaysData()}
          cx={400}
          cy={200}
          labelLine={false}
          label={({ name, value, percent }) =>
            `${name}: ${(percent * 100).toFixed(2)}%`
          }
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {getDelayDaysData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
         ))}
        </Pie>
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            marginTop: '-40px', // Adjust this value to move the legend up
          }}
        />      </PieChart>
    </div>
    
  </div>
)}



{selectedCustomer && isSubmitted && customerInfo && (
  <div className="chart-container">
    <h2>How does Payment Ratio Relate to the Number of Missed Payments for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
      <BarChart width={1000} height={400} data={[customerInfo]}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="customer_name" label={{ value: 'Missed Payments', position: 'insideBottom' }} />
        <YAxis label={{ value: 'Payment Ratio', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{
            marginTop: '-40px', // Adjust this value to move the legend up
          }}
        />
        <Bar type="monotone" dataKey="payment_ratio" fill="#8884d8" name="Payment Ratio" />
        <Bar type="monotone" dataKey="missed_payments" fill="#82ca9d" name="Number of Missed Payments" />
      </BarChart>
    </div>
  </div>
)}




{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>What is the Total Amount per Year for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
    <ResponsiveContainer width="90%" height={400} >
      <ComposedChart data={groupDataByYear(transactionInfo)}>
      <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="year" angle={-45}
                textAnchor="end"
                interval={0}
                height={80} 
                tick={{ dy: 10 }}  label={{ value: 'Year', position: 'insideBottom', offset: 0 }} />
        <YAxis  width={100} 
                tick={{ dy: 10 }}  label={{ value: 'Payments', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={false} formatter={(value, name, props) => {
  return currencySymbol ? ` ${currencySymbol} ${Number(value).toFixed(1)}` : `Total Amount: ${Number(value).toFixed(1)}`;
}} />
<Legend
  verticalAlign="top"
  align="right"
  wrapperStyle={{
    marginTop: '-40px', // Adjust this value to move the legend up
  }}
/>
        <Bar dataKey="total_amount" fill="#8884d8" name="Total Amount" barSize={120}  />
        <Line type="monotone" dataKey="total_amount" stroke="#82ca9d" name="Total Amount" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
  </div>
)}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2> What Is the Payment Status Variation Over the Years for {capitalizeEveryWord(selectedCustomer)}? </h2>
    <div className="center">
    <ResponsiveContainer width="90%" height={400}>
      <ComposedChart data={groupDataByYearAndPaymentStatus(transactionInfo)} width={700} height={400}>
      <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="year" angle={-45}
                textAnchor="end"
                interval={0}
                height={80} 
                tick={{ dy: 10 }}  label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />    
                  <YAxis  width={100} 
                tick={{ dy: 10 }} label={{ value: 'Payments', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={false} formatter={(value, name, props) => {
          return currencySymbol ? ` ${currencySymbol} ${Number(value).toFixed(1)}` : `Total Amount: ${Number(value).toFixed(1)}`;
        }} />
<Legend
  verticalAlign="top"
  align="right"
  wrapperStyle={{
    marginTop: '-40px', // Adjust this value to move the legend up
  }}
/>
        <Bar dataKey="MissedPayments" fill="#FF5733" name="Missed Payments"  barSize={120} />
        <Bar dataKey="LatePayments" fill="#FFD700" name="Late Payments"  barSize={120}  />
        <Bar dataKey="EarlyPayments" fill="#228B22" name="Early Payments"   barSize={120}/>
        <Bar dataKey="TimelyPayments" fill="#5F9EA0" name="Timely Payments"  barSize={120} />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
  </div>
)}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2> What Is the Incidence of Missed Payments Over the Years for {capitalizeEveryWord(selectedCustomer)}? </h2>
    <div className="center">
    <ResponsiveContainer width="90%" height={400}>
      <ComposedChart data={groupDataByYearAndPaymentStatus(transactionInfo)} >
      <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="year" angle={-45}
                textAnchor="end"
                interval={0}
                height={80} 
                tick={{ dy: 10 }}  label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />    
                  <YAxis  width={100} 
                tick={{ dy: 10 }} label={{ value: 'Payments', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={false} formatter={(value, name, props) => {
          return currencySymbol ? ` ${currencySymbol} ${Number(value).toFixed(1)}` : `Total Amount: ${Number(value).toFixed(1)}`;
        }} />
<Legend
  verticalAlign="top"
  align="right"
  wrapperStyle={{
    marginTop: '-40px', // Adjust this value to move the legend up
  }}
/>
        <Bar dataKey="MissedPayments" fill="#FF5733" name="Missed Payments" barSize={120}  />
        <Line type="monotone" dataKey="MissedPayments" stroke="#82ca9d" name="Missed Payments" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
  </div>
)}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>What Is the Occurrence of Late Payments Over the Years for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
    <ResponsiveContainer width="90%" height={400}>
      <ComposedChart data={groupDataByYearAndPaymentStatus(transactionInfo)} >
      <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="year" angle={-45}
                textAnchor="end"
                interval={0}
                height={80} 
                tick={{ dy: 10 }}  label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />    
                  <YAxis  width={100} 
                tick={{ dy: 10 }} label={{ value: 'Payments', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={false} formatter={(value, name, props) => {
          return currencySymbol ? ` ${currencySymbol} ${Number(value).toFixed(1)}` : `Total Amount: ${Number(value).toFixed(1)}`;
        }} />
<Legend
  verticalAlign="top"
  align="right"
  wrapperStyle={{
    marginTop: '-40px', // Adjust this value to move the legend up
  }}
/>
        <Bar dataKey="LatePayments" fill="#FFD700" name="Late Payments"  barSize={120} />
        <Line type="monotone" dataKey="LatePayments" stroke="#82ca9d" name="Late Payments" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
  </div>
)}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>What Is the Prevalence of Early Payments Over the Years for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
    <ResponsiveContainer width="90%" height={400}>
      <ComposedChart data={groupDataByYearAndPaymentStatus(transactionInfo)} >
      <CartesianGrid strokeDasharray="1 1" />
        <XAxis   dataKey="year" angle={-45}
                textAnchor="end"
                interval={0}
                height={80} 
                tick={{ dy: 10  }}  label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />    
                  <YAxis  width={100} 
                tick={{ dy: 10 }} label={{ value: 'Payments', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={false} formatter={(value, name, props) => {
          return currencySymbol ? ` ${currencySymbol} ${Number(value).toFixed(1)}` : `Total Amount: ${Number(value).toFixed(1)}`;
        }} />
<Legend
  verticalAlign="top"
  align="right"
  wrapperStyle={{
    marginTop: '-40px', // Adjust this value to move the legend up
  }}
/>
        <Bar dataKey="EarlyPayments" fill="#228B22" name="Early Payments"  barSize={120}  />
        <Line type="monotone" dataKey="EarlyPayments" stroke="#82ca9d" name="Early Payments" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
  </div>
)}



{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>What Is the Frequency of Timely Payments Over the Years for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
    <ResponsiveContainer width="90%" height={400}>
      <ComposedChart data={groupDataByYearAndPaymentStatus(transactionInfo)}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis  dataKey="year" angle={-45}
                textAnchor="end"
                interval={0}
                height={80} 
                tick={{ dy: 10 }}  label={{ value: 'Year',  position: 'insideBottom', offset: -2 , style: { fontWeight: 'normal' } }} />    
                  <YAxis  width={100} 
                tick={{ dy: 10 }} label={{ value: 'Payments', angle: -90, position: 'insideLeft' }} />
        <Tooltip cursor={false} formatter={(value, name, props) => {
          return currencySymbol ? ` ${currencySymbol} ${Number(value).toFixed(1)}` : `Total Amount: ${Number(value).toFixed(1)}`;
        }} />
<Legend
  verticalAlign="top"
  align="right"
  wrapperStyle={{
    marginTop: '-40px', // Adjust this value to move the legend up
  }}
/>
        <Bar dataKey="TimelyPayments" fill="#5F9EA0" name="Timely Payments" barSize={120}  />
        <Line type="monotone" dataKey="TimelyPayments" stroke="#82ca9d" name="Timely Payments" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
  </div>
)}


  
  </>
        )}
        
      </div>
      
            </div>
                )}



{selectedContent === 'regions' && (
  <div className="customer-list-container">
    {isLoading ? (
      <div className="loading-spinner"></div>
    ) : (
      <>

             {isDistrictLoading && (
  <div className="loading-spinner"></div>
)}
        <h2> Region (District) </h2>
        <form onSubmit={handleDistrictSubmit}>
          <div>
            <label>Select a District:</label>
            <select value={selectedDistrict} onChange={handleDistrictSelectChange}>
              <option value=""> Select a Region </option>
              {districts.sort().map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>

 

      {/* Display customers and credit score information only if submitted */}
{isDistrictSubmitted && selectedDistrict && districtCreditScore && (
  <div className="credit-score-table">
    <h2>Customers in {selectedDistrict} with Credit Score Information</h2>
    <table>
    <thead>
              <tr>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Amount Paid</th>
                <th>Delay Days</th>
                <th>Credit Score</th>
          <th>Payment Ratio</th>
          <th>Credit Category</th>
          <th>Amount Owed</th>
          <th>Missed Payments</th>
          <th>Number of Transactions</th>
                        </tr>
            </thead>
      <tbody>
        {/* Table rows */}
        {districtCreditScore.map((score, index) => (
          <tr key={index}>
                  <td>{score.customerName}</td>
                  <td>{score.total_amount}</td>
                  <td>{score.amount_paid}</td>
                  <td>{score.delay_days}</td>
                  <td>{score.credit_score}</td>
            <td>{score.payment_ratio}</td>
            <td>{score.credit_category}</td>
            <td>{score.amount_owed}</td>
            <td>{score.missed_payments}</td>
            <td>{score.number_of_transactions}</td>
                  {/* Add other credit score details as needed */}
                </tr>
              ))}
      </tbody>
    </table>
  </div>
)}

 </>
        )}
        
      </div>
                )}

              </div>
            </div>
          );
        }
        
        export default Dashboard;
        











        
         