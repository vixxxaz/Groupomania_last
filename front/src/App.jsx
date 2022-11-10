import Login from './pages/Login/index'
import Post from './pages/Post/index'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register/index';
import Home from './pages/Home/index';
import UpdatePost from './pages/UpdatePost/index';
import Navbar from './component/Navbar';
import Delete from './pages/Delete';
import './styles/app.css'
import Footer from './component/Footer';
import ErrorPage from './pages/ErrorPage/index';

//Router de l application avec navbar et footer sur toutes les pages
function App() {
  return (
    <>
      <Navbar />
        <section>
          <Post />
          <Login />
          <Register />
          <UpdatePost />
          <Delete />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
        </section>
      <Footer />
    </>
  );
}

export default App; 