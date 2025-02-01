import './App.css';
import { ContentArea, FormContainer, FormWrapper, InputField, InputLabel, MainContainer, SubmitButton, TableTitle, TableWrapper } from './styled';
import Navbar from './components/header';
import TableCommissions from './components/TableCommissions';
import TableMarketing from './components/TableMarketing';
import { useState } from 'react';
import TablePayment from './components/TablePayment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [penjualanID, setPenjualanID] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0); 

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
        toast.error(`Gagal: ${errorData.message || 'Terjadi kesalahan'}`);
        return;
      }

      const responseData = await response.json();
      toast.success('Pembayaran berhasil! 🎉');
      console.log('Payment successful:', responseData);

      setPenjualanID(0);
      setAmountPaid(0);

      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Request failed:', error);
      toast.error('Gagal: Server tidak merespons');
    }
  };

  return (
    <MainContainer>
      <Navbar/>
      <TableWrapper>
        <ContentArea>
          <TableWrapper>
            <TableTitle>Data Pegawai Marketing</TableTitle>
            <TableMarketing/>
          </TableWrapper>

          <TableWrapper>
            <TableTitle>Data Komisi</TableTitle>
            <TableCommissions/>
          </TableWrapper>
        </ContentArea>
        <ContentArea>
          <TableWrapper>
            <TableTitle>Tabel Pembayaran</TableTitle>
            <TablePayment key={refreshKey} />  
          </TableWrapper>
        
          <TableWrapper>
            <TableTitle>Form Pembayaran</TableTitle>
            <FormWrapper>
              <FormContainer onSubmit={handleSubmit}>
                <InputLabel htmlFor="penjualan_id">Penjualan ID</InputLabel>
                <InputField
                  type="number"
                  id="penjualan_id"
                  name="penjualan_id"
                  value={penjualanID}
                  onChange={(e) => setPenjualanID(Number(e.target.value))}
                />
                <InputLabel htmlFor="amount_paid">Amount</InputLabel>
                <InputField
                  type="number"
                  id="amount_paid"
                  name="amount_paid"
                  value={amountPaid}
                  onChange={handleAmountChange}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
              </FormContainer>
            </FormWrapper>
          </TableWrapper>
          
        </ContentArea>
      </TableWrapper>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </MainContainer>
  );
}

export default App;
