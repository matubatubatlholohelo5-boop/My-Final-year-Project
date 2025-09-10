import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login'; 
import Register from './pages/Register'; 
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Layout>
  );
}

export default App;