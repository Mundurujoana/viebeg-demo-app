import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const HealthFacility = () => {
          const { customerName } = useParams();
          const [customerData, setCustomerData] = useState(null);
          const [customerInfo, setCustomerInfo] = useState(null);
          const [transactionInfo, setTransactionInfo] = useState(null);
          const [isSubmitted, setIsSubmitted] = useState(false);
        
          const apiUrl = 'https://viebeg-server.onrender.com'; // Define apiUrl


          
          useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await fetch(`${apiUrl}/api/customers?name=${customerName}`);
                const data = await response.json();
        
                if (data && data.length > 0) {
                  const selectedCustomerData = data.find((customer) => customer.customer_name === customerName);
        
                  if (selectedCustomerData) {
                    const custId = selectedCustomerData.cust_id;
        
                    const creditScoreResponse = await fetch(`${apiUrl}/api/customers/${custId}/creditScore`);
                    const creditScoreData = await creditScoreResponse.json();
        
                    const transactionsResponse = await fetch(`${apiUrl}/api/customers/${custId}/transactions`);
                    const transactionsData = await transactionsResponse.json();
        
                    setCustomerData(selectedCustomerData);
                    setCustomerInfo(creditScoreData);
                    setTransactionInfo(transactionsData);
                    setIsSubmitted(true);
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
        
            fetchData();
          }, [customerName]);
        
          const formatDate = (date) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('en-US', options);
          };
        
          return (
            <div>
              {isSubmitted && customerData && (
                <div className="customer-info">
                  <h2>{customerName} Location Information</h2>
                  <p>Location Country: {customerData.location_country}</p>
                  <p>Location Province: {customerData.location_province}</p>
                  <p>Location District: {customerData.location_district}</p>
                  <p>Location Sector: {customerData.location_sector}</p>
                  <p>Sector ID: {customerData.sector_id}</p>
                  <p>Type: {customerData.type}</p>
                </div>
              )}
        
              {isSubmitted && customerInfo && (
                <div className="customer-info">
                  <h2>{customerName} CreditScore Information</h2>
                  <p>Facility Name: {customerName}</p>
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
        
              {isSubmitted && transactionInfo && (
                <div className="customer-info">
                  <h2>{customerName} Transaction Information</h2>
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
            </div>
          );
        };
        


export default HealthFacility