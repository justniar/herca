import { useState } from 'react';
import './App.css';
import { StyledTable, TableCell, TableContainer, TableDataRow, TableHeader, TableHeaderCell, TableRow } from './styled';

function App() {
  const [commissions, setCommissions] = useState([]);

  return (
    <>
      <TableContainer>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Marketing</TableHeaderCell>
              <TableHeaderCell>Bulan</TableHeaderCell>
              <TableHeaderCell>Omzet</TableHeaderCell>
              <TableHeaderCell>Komisi %</TableHeaderCell>
              <TableHeaderCell>Komisi Nominal</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            <TableRow>
              <TableDataRow>Apple MacBook Pro 17"</TableDataRow>
              <TableCell>Silver</TableCell>
              <TableCell>Laptop</TableCell>
              <TableCell>$2999</TableCell>
            </TableRow>
            <TableRow>
              <TableDataRow>Microsoft Surface Pro</TableDataRow>
              <TableCell>White</TableCell>
              <TableCell>Laptop PC</TableCell>
              <TableCell>$1999</TableCell>
            </TableRow>
            <TableRow>
              <TableDataRow>Magic Mouse 2</TableDataRow>
              <TableCell>Black</TableCell>
              <TableCell>Accessories</TableCell>
              <TableCell>$99</TableCell>
            </TableRow>
          </tbody>
        </StyledTable>
      </TableContainer>
    </>
  );
}

export default App;
