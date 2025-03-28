import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Login from './components/Login';
import Upload from './components/upload';

const CLIENT_ID = "1092582505072-0selu4e2vg5trgm2kj7lv1oplmelvq9c.apps.googleusercontent.com"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path="/home" element={<App/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/upload" element={<Upload/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
