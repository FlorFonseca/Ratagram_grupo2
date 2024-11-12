import "./styles/App.css";
//import LoginComponent from './routes/Login.js';
// import SignUp from './routes/Signup';
import Home from "./routes/Home";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <LoginComponent/> */}
        {/* <SignUp/> */}
        <Home />
      </header>
    </div>
  );
}



export default App;
