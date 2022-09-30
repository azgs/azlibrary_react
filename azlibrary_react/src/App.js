import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Item from "./pages/Item";
import NoPage from "./pages/NoPage";
import 'arizona-bootstrap/dist/css/arizona-bootstrap.min.css';
import 'arizona-bootstrap';
import './Style.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/item/:collectionId" element={<Item />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
