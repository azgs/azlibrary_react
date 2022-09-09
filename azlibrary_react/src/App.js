// import logo from './logo.svg';
import NavBar from './NavBar';
import Search from './Search';
import './App.css';

const baseUrl = "https://devdata.azgs.arizona.edu/api/v1";

function App() {
  return (
    <div className="App">
      <NavBar />

      <Search baseUrl={baseUrl} />

    </div>
  );
}

export default App;
