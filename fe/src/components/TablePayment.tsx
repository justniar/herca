import React, { useState } from 'react';
import { StyledTable, TableCell, TableHeader, TableHeaderCell, TableRow } from '../styled';

interface Payment {
  id: string;
  penjualanId: string;
  date: string;
  amountPaid: number;
  remainingBalance: number;
}

const TablePayment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [penjualanId, setPenjualanId] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [remainingBalance, setRemainingBalance] = useState<number>(0);

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    useEffect(()=>{
        const fetchCommissions = async () => {
        try {
            const response = await fetch('http://localhost:8080/payment');
            const data = await response.json();
            setCommissions(data);
        } catch (error) {
             console.error('Error fetching commissions:', error);
        }
        }
        fetchCommissions();
    },[]);

    if (response.ok) {
    const data = await response.json();
    setRemainingBalance(data.remaining_balance);
    setPayments([...payments, data]);
    } else {
    console.error('Failed to process payment');
    }
    };

    const newPayment: Payment = {
      id: (payments.length + 1).toString(),
      penjualanId,
      date: paymentDate,
      amountPaid,
      remainingBalance: remainingBalance - amountPaid,
    };

    setPayments([...payments, newPayment]);
    setPenjualanId('');
    setAmountPaid(0);
    setPaymentDate('');
    setRemainingBalance(remainingBalance - amountPaid);
  };

  return (
    <div>
      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>ID Pembayaran</TableHeaderCell>
            <TableHeaderCell>ID Penjualan</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Total Bayar</TableHeaderCell>
            <TableHeaderCell>Sisa</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.penjualanId}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.amountPaid}</TableCell>
              <TableCell>{payment.remainingBalance}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      <form onSubmit={handlePaymentSubmit}>
        <label htmlFor="penjualanId">ID Penjualan:</label>
        <input
          type="text"
          id="penjualanId"
          name="penjualanId"
          value={penjualanId}
          onChange={(e) => setPenjualanId(e.target.value)}
        />
        <br />
        <label htmlFor="pembayaranAmount">Amount Paid:</label>
        <input
          type="number"
          id="pembayaranAmount"
          name="pembayaranAmount"
          value={amountPaid}
          onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
        />
        <br />
        <label htmlFor="pembayaranDate">Date:</label>
        <input
          type="date"
          id="pembayaranDate"
          name="pembayaranDate"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TablePayment;
