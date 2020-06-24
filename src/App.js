import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from './hooks';
import Header from './components/header';
import { Routes } from './routes';

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastContainer />
        <Header />
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
