import React, { useState, useEffect } from 'react';
import './customerList.css';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


const CustomerList = () => {
  const [customerNames, setCustomerNames] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const fetchCustomerNames = async () => {
      try {
        // const response = await fetch('http://localhost:5000/api/customers');
        const response = await fetch('https://viebeg-server.onrender.com/api/customers');

        const data = await response?.json();
        setCustomerNames(data.map((customer) => customer.customer_name));
      } catch (error) {
        console.error('Error fetching customer names:', error);
      }
    };

    fetchCustomerNames();
  }, []);

  const handleSelectChange = async (e) => {
    const customerName = e.target.value;
    setSelectedCustomer(customerName);
    setIsSubmitted(false);

    try {
      const response = await fetch(`https://viebeg-server.onrender.com/api/customers?name=${customerName}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const selectedCustomerData = data.find((customer) => customer.customer_name === customerName);

        if (selectedCustomerData) {
          const custId = selectedCustomerData.cust_id;

          const creditScoreResponse = await fetch(`https://viebeg-server.onrender.com/api/customers/${custId}/creditScore`);
          const creditScoreData = await creditScoreResponse.json();

          // Fetch transaction data for the selected customer
          const transactionsResponse = await fetch(`https://viebeg-server.onrender.com/api/customers/${custId}/transactions`);
          const transactionsData = await transactionsResponse.json();

          // Set both credit score and transaction info separately
          setCustomerData(selectedCustomerData);
          setCustomerInfo(creditScoreData);
          setTransactionInfo(transactionsData);
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


  return (
    <div className="customer-list-container">
      <h2>Health Facilities</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select a facility:</label>
          <select value={selectedCustomer} onChange={handleSelectChange}>
            <option value="">Select a customer</option>
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

      {selectedCustomer && isSubmitted && customerData && (
        <div className="customer-info">
          <h2>{selectedCustomer} Information</h2>
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
          <p>Facility Name: {selectedCustomer}</p>
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
        {/* Add meaningful visualization for transactions here */}
        <h2>Transaction Data</h2>
        <BarChart width={800} height={500} data={sortedTransactionInfo}>
          <CartesianGrid stroke="#ccc" />
          <XAxis
            dataKey="date_invoice"
            label={{
              value: 'Date Invoice',
              position: 'insideBottom',
              offset: 30, // Increase the offset for more separation
              dy: 60,
            }}
            tick={{ angle: 45, textAnchor: 'start' }}
            tickFormatter={formatDate} // Format the dates on the X-axis
          />
          <YAxis
            label={{
              value: 'Total Amount',
              angle: -90,
              position: 'insideLeft',
              dy: -10,
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_amount" barSize={100} fill="#8884d8" name="Total Amount" />
        </BarChart>
      </div>
)}

{selectedCustomer && isSubmitted && transactionInfo && (
<div className="chart-container">
      <h2>{selectedCustomer} - Amount Paid vs. Total Amount</h2>
          <LineChart width={600} height={300} data={[customerInfo]}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="customer_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_amount" stroke="#8884d8" name="Total Amount" />
            <Line type="monotone" dataKey="amount_paid" stroke="#82ca9d" name="Amount Paid" />
          </LineChart>
          </div>
          )}
          

{selectedCustomer && isSubmitted && transactionInfo && (
          <div className="chart-container">
          <h2>{selectedCustomer} - Credit Score vs. Number of Transactions</h2>
          <LineChart width={600} height={300} data={[customerInfo]}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="customer_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="credit_score" stroke="#8884d8" name="Credit Score" />
            <Line
              type="monotone"
              dataKey="number_of_transactions"
              stroke="#82ca9d"
              name="Number of Transactions"
            />
          </LineChart>
          </div>
          )}
          {selectedCustomer && isSubmitted && customerInfo && (
  <div className="chart-container">
    <h2>{selectedCustomer} - Credit Score vs. Total Amount Owed</h2>
    <BarChart width={600} height={300} data={[customerInfo]}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="customer_name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar type="monotone" dataKey="credit_score" fill="#8884d8" name="Credit Score" />
      <Bar type="monotone" dataKey="amount_owed" fill="#82ca9d" name="Total Amount Owed" />
    </BarChart>
  </div>
)}

{selectedCustomer && isSubmitted && customerInfo && (
  <div className="chart-container">
    <h2>{selectedCustomer} - Payment Ratio vs. Number of Missed Payments</h2>
    <BarChart width={600} height={300} data={[customerInfo]}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="customer_name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar type="monotone" dataKey="payment_ratio" fill="#8884d8" name="Payment Ratio" />
      <Bar type="monotone" dataKey="missed_payments" fill="#82ca9d" name="Number of Missed Payments" />
    </BarChart>
  </div>
)}


    </div>
  );
};

export default CustomerList;
