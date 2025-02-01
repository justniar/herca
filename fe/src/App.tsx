import './App.css';
import { ContentArea, FormWrapper, MainContainer, StyledTable, TableCell, TableHeader, TableHeaderCell, TableRow, TableWrapper } from './styled';
import Navbar from './components/header';
import TableCommissions from './components/TableCommissions';
import TableMarketing from './components/TableMarketing';



function App() {
  return (
    <>
    <MainContainer>
      <Navbar/>
      <TableWrapper>
        <ContentArea>
            <TableMarketing/>
            <TableCommissions/>
        </ContentArea>
        <ContentArea>
          <StyledTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Pembayaran ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
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

          <FormWrapper>
            <form>
              <label htmlFor="pembayaranAmount">Amount</label>
              <input type="number" id="pembayaranAmount" name="pembayaranAmount" />
              <br />
              <label htmlFor="pembayaranDate">Date</label>
              <input type="date" id="pembayaranDate" name="pembayaranDate" />
              <br />
              <button type="submit">Submit</button>
            </form>
          </FormWrapper>
        </ContentArea>
            
      </TableWrapper>
      
      </MainContainer>
    </>
  );
}

export default App;
