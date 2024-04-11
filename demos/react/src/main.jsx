import React from 'react';
import ReactDOM from 'react-dom/client';
import { init } from '../../../src/main/index';
import App from './App.jsx';
import About from './components/About.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

init({
  reportUrl: `http://localhost:3000/monitor`,
  source: 'PC',
  isLazyReport: true,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/about',
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
