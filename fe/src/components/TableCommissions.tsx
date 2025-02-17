import { useEffect, useState } from 'react'
import { StyledTable, TableCell, TableDataRow, TableHeader, TableHeaderCell, TableRow } from '../styled';

interface Commission {
  marketing_name: string;
  month: string;
  omzet: number;
  commission_pct: number;
  commission_nominal: number;
}

const TableCommissions = () => {
    const [commissions, setCommissions] = useState<Commission[]>([]);

    useEffect(()=>{
        const fetchCommissions = async () => {
        try {
            const response = await fetch('http://localhost:8080/commissions');
            const data = await response.json();
            setCommissions(data);
        } catch (error) {
            console.error('Error fetching commissions:', error);
        }
        }
        fetchCommissions();
    },[]);

  return (
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
                {commissions.map((commissions, index)=>(
                <TableRow key={index}>
                    <TableDataRow>{commissions.marketing_name}</TableDataRow>
                    <TableCell>{commissions.month}</TableCell>
                    <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(commissions.omzet)}</TableCell>
                    <TableCell>{commissions.commission_pct.toFixed(2)}%</TableCell>
                    <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(commissions.commission_nominal)}</TableCell>
                    </TableRow>
                ))}
            </tbody>
    </StyledTable>
  )
}

export default TableCommissions