import { useEffect, useState } from 'react'
import { StyledTable, TableCell, TableDataRow, TableHeader, TableHeaderCell, TableRow } from '../styled'

interface Marketing {
    id: string;
    marketing_name: string;
}

const TableMarketing = () => {
    const [marketing, setMarketing] = useState<Marketing[]>([])

    useEffect(()=>{
        const fetchMarketing = async () => {
        try {
            const response = await fetch('http://localhost:8080/marketing');
            const data = await response.json();
            setMarketing(data);
        } catch (error) {
            console.error('Error fetching Marketing:', error);
        }
        }
        fetchMarketing();
    },[]);
        
  return (
    <StyledTable>
        <TableHeader>
            <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
        </TableHeader>
            <tbody>
            {marketing.map((marketing, i)=>(
                <TableRow key={i}>
                    <TableDataRow>{marketing.id}</TableDataRow>
                    <TableCell>{marketing.marketing_name}</TableCell>
                </TableRow>
            ))}
            </tbody>
    </StyledTable>
  )
}

export default TableMarketing