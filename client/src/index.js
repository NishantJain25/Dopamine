import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ContactPage from './pages/contact-page/contact-page';
import AddContact from './pages/add-contact/add-contact';
import EditContact from './pages/edit-contact/edit-contact';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "contacts/add",
        element: <AddContact />
      },
      {
        path: "contacts/:id",
        element: <ContactPage />
      },
      {
        path: "contacts/edit/:id",
        element: <EditContact />
      },
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

