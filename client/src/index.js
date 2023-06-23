import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import Home from './Components/HomePage/home'
import Login from './Components/Login/Login.js'
import Register from './Components/Login/Register'
import BuyCoin from './Components/buyPage/BuyCoinPage.js'
import { Routes, Route } from 'react-router-dom'
import History from './Components/History/history';
import Contest from './Components/ContestPage/contest';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contest" element={<Contest />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/History" element={<History />} />
        <Route path="/buyCoin/:type" element={<BuyCoin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


