import React, { useState, useEffect } from 'react';
import './customerList.css';
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


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



{/* {selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>{selectedCustomer} - Payment Method Distribution</h2>
    <PieChart width={600} height={300}>
      <Pie
        data={getPaymentMethodData()}
        cx={300}
        cy={150}
        labelLine={false}
        label={(entry) => `${entry.name}: ${entry.value}`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {getPaymentMethodData().map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </div>
)} */}


{selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
        <h2>How is the currency distributed for {capitalizeEveryWord(selectedCustomer)}?</h2>
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
    </PieChart>
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
    </PieChart>
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
    </PieChart>
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
      </PieChart>
    </div>
  </div>
)}

{selectedCustomer && isSubmitted && customerInfo && (
  <div className="chart-container">
    <h2>How does Payment Ratio Relate to the Number of Missed Payments for {capitalizeEveryWord(selectedCustomer)}?</h2>
    <div className="center">
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
  </div>
)}


{/* {selectedCustomer && isSubmitted && transactionInfo && (
  <div className="chart-container">
    <h2>{selectedCustomer} - Delay Days Distribution</h2>
    <div className="center">
      <PieChart width={700} height={400}>
        <Pie
          data={getDelayDaysData()}
          cx={300}
          cy={200}
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {getDelayDaysData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
         ))}
        </Pie>
      </PieChart>
    </div>
  </div>
)} */}


    </div>
  );
};

export default CustomerList;
