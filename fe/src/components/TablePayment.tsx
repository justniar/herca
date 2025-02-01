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
              <TableCell>{new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(payment.payment_date))}</TableCell>
              <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount_paid)}</TableCell>
              <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.remaining_balance)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </>
  );
};

export default TablePayment;
