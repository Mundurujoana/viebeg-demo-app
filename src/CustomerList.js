import React, { useState, useEffect } from 'react';
import './customerList.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';

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
                  <td>{transaction.date_requested}</td>
                  <td>{transaction.date_invoice}</td>
                  <td>{transaction.due_date}</td>
                  <td>{transaction.delay_days}</td>
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

      {selectedCustomer && isSubmitted && customerInfo && (
        <div className="customer-info">
          <h2>{selectedCustomer} Credit score visualization</h2>
          <BarChart width={600} height={400} data={[customerInfo]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_amount" fill="#8884d8" name="Total Amount" />
            <Bar dataKey="amount_owed" fill="#82ca9d" name="Amount Owed" />
            <Bar dataKey="missed_payments" fill="#ffc658" name="Missed Payments" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
