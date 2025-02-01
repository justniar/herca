import { useEffect, useState } from 'react';
import { StyledTable, TableCell, TableHeader, TableHeaderCell, TableRow} from '../styled';

interface Payment {
  id: number;
  penjualan_id: number;
  payment_date: string;
  amount_paid: number;
  remaining_balance: number;
}

const TablePayment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:8080/payment');
        if (!response.ok) throw new Error('Failed to fetch payment');
        const data: Payment[] = await response.json();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payment:', error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <>
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
              <TableCell>{payment.penjualan_id}</TableCell>
              <TableCell>{payment.payment_date}</TableCell>
              <TableCell>{payment.amount_paid}</TableCell>
              <TableCell>{payment.remaining_balance}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </>
  );
};

export default TablePayment;
