import React, { useState, useEffect } from 'react';
import './customerList.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomerList = () => {
  const [customerNames, setCustomerNames] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCustomerNames = async () => {
      try {
        const response = await fetch('/api/customers');
        const data = await response.json();
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
      const response = await fetch(`/api/customers?name=${customerName}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const custId = data.find((customer) => customer.customer_name === customerName)?.cust_id;

        if (custId) {
          const creditScoreResponse = await fetch(`/api/customers/${custId}/creditScore`);
          const creditScoreData = await creditScoreResponse.json();
          setCustomerInfo(creditScoreData);
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
      <h2> Health Facilities </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select a facility:</label>
          <select value={selectedCustomer} onChange={handleSelectChange}>
            <option value="">Select a customer</option>
            {customerNames.map((name, index) => (
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

      {selectedCustomer && isSubmitted && customerInfo && (
        <div className="customer-info">
          <h2> {selectedCustomer} Information</h2>
          <p>Facility Name: {selectedCustomer}</p>
          <p>Total amount: {customerInfo.total_amount}</p>
          <p>Credit category: {customerInfo.credit_category}</p>
          <p>Amount owed: {customerInfo.amount_owed}</p>
          <p>Missed payments: {customerInfo.missed_payments}</p>
        </div>
      )}

      {selectedCustomer && isSubmitted && customerInfo && (
        <div className="customer-info">
          <h2> {selectedCustomer} Creditscore visualisation </h2>
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
