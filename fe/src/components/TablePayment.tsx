import React from 'react'
import { StyledTable, TableCell, TableHeader, TableHeaderCell, TableRow } from '../styled'


const TablePayment = () => {
  return (
    <StyledTable>
        <TableHeader>
        <TableRow>
            <TableHeaderCell>Pembayaran ID</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Remaining Balance</TableHeaderCell>
        </TableRow>
        </TableHeader>
        <tbody>
        <TableRow>
            <TableCell>123</TableCell>
            <TableCell>100,000</TableCell>
            <TableCell>2025-02-01</TableCell>
        </TableRow>
        </tbody>
    </StyledTable>
  )
}

export default TablePayment