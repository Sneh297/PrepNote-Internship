import { Routes, Route, Router } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Test from './pages/Test';
import ProtectedRoutes from '../utils/ProtectedRoutes';
import ManageTest from './pages/ManageTest';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route element={<ProtectedRoutes />}>
        <Route path='/test' element={<Test />} />
        <Route path='/manage-test' element={<ManageTest />} />
      </Route>
    </Routes>
  );
}

export default App;
