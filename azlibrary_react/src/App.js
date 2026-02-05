import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Item from "./pages/Item";
import NoPage from "./pages/NoPage";
import Contact from "./pages/Contact";
import 'arizona-bootstrap/dist/css/arizona-bootstrap.min.css';
import 'arizona-bootstrap';
import './Style.css';
import { createContext, useState, useEffect } from 'react'
import ReactGA from 'react-ga4';

export const FormContext = createContext({});

// Component to handle page view tracking
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (process.env.REACT_APP_GA4_MEASUREMENT_ID) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);

  return null;
}

function App() {

  // API Search Parameters for use in FormContext. 
  const [apiSearchParams, setApiSearchParams] = useState({});

  return (
    <FormContext.Provider value={{apiSearchParams, setApiSearchParams}}>
    <BrowserRouter>
      <PageTracker />
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
