import { Routes, Route } from 'react-router-dom';
import NavBar from './pagina_principal/NavBar/NavBar';
import RegisterForm from './register/register';

function App() {
  return (
    <>
      <NavBar />
      
      <Routes>
        <Route path="/registro" element={<RegisterForm />} />
      </Routes>
    </>
  );
}

export default App;
