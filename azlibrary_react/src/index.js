import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4';

if (process.env.REACT_APP_GA4_MEASUREMENT_ID) {
    console.log("Initializing GA4 with Measurement ID: " + process.env.REACT_APP_GA4_MEASUREMENT_ID);
    ReactGA.initialize(process.env.REACT_APP_GA4_MEASUREMENT_ID);
    
    // Set user property for site variant
    ReactGA.gtag("set", "user_properties", {
        site_variant: process.env.REACT_APP_SITE || "azlibrary"
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
