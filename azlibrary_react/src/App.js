import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Item from "./pages/Item";
import NoPage from "./pages/NoPage";
import Contact from "./pages/Contact";
import 'arizona-bootstrap/dist/css/arizona-bootstrap.min.css';
import 'arizona-bootstrap';
import './Style.css';
import { createContext, useState } from 'react'

export const FormContext = createContext({});

function App() {

  // API Search Parameters for use in FormContext. 
  const [apiSearchParams, setApiSearchParams] = useState({});

  return (
    <FormContext.Provider value={{apiSearchParams, setApiSearchParams}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/item/:collectionId" element={<Item />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </FormContext.Provider>
  );
}

export default App;
