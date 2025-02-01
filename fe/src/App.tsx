import './App.css';
import { ContentArea, FormWrapper, MainContainer, TableWrapper } from './styled';
import Navbar from './components/header';
import TableCommissions from './components/TableCommissions';
import TableMarketing from './components/TableMarketing';
import { useState } from 'react';

function App() {
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [penjualanID, setPenjualanID] = useState<number>(0); 

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountPaid(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = {
      penjualan_id: penjualanID,
      amount_paid: amountPaid,
    };

    try {
      const response = await fetch('http://localhost:8080/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        return;
      }

      const responseData = await response.json();
      console.log('Payment successful:', responseData);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <MainContainer>
      <Navbar/>
      <TableWrapper>
        <ContentArea>
          <TableMarketing/>
          <TableCommissions/>
        </ContentArea>
        <ContentArea>
          <FormWrapper>
            <form onSubmit={handleSubmit}>
              <label htmlFor="penjualan_id">Penjualan ID</label>
              <input
                type="number"
                id="penjualan_id"
                name="penjualan_id"
                value={penjualanID}
                onChange={(e) => setPenjualanID(Number(e.target.value))}
              />
              <br />
              <label htmlFor="amount_paid">Amount</label>
              <input
                type="number"
                id="amount_paid"
                name="amount_paid"
                value={amountPaid}
                onChange={handleAmountChange}
              />
              <br />
              <button type="submit">Submit</button>
            </form>
          </FormWrapper>
        </ContentArea>
      </TableWrapper>
    </MainContainer>
  );
}

export default App;
