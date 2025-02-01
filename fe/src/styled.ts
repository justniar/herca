import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

export const ContentArea = styled.div`
  display: flex;
  width: 80vw; 
  padding: 20px;
  gap: 5rem;
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormWrapper = styled.div`
  margin-top: 2rem;
`;


export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 50%;
  font-size: 0.875rem;
  text-align: left;
  color: #6B7280; 
  direction: rtl;
  
  @media (prefers-color-scheme: dark) {
    color: #D1D5DB; 
  }
`;

export const TableHeader = styled.thead`
  font-size: 0.75rem;
  color: #374151;
  background-color: #F9FAFB;

  @media (prefers-color-scheme: dark) {
    background-color: #374151;
    color: #D1D5DB; 
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #E5E7EB; 
  
  &:nth-child(even) {
    background-color: #F9FAFB; 
  }

  @media (prefers-color-scheme: dark) {
    background-color: #1F2937;
    border-color: #374151; 
  }
`;

export const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const TableCell = styled.td`
  padding: 0.75rem 1.5rem;
`;

export const TableDataRow = styled.th`
  padding: 1rem 1.5rem;
  font-weight: 500;
  text-color: #111827; 
  
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

export const NavBar = styled.header`
    width: 20%;
    height: 100vh;
    background-color:rgb(215, 225, 245);
    color: #fff;
    padding: 5px;
    margin-bottom: 2rem;
    text-align: right;
`;

export const Nav = styled.nav`
`;