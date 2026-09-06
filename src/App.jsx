import Navbar from "./NavBar.jsx";
import Home from "./Home.jsx";
import MyLearning from "./MyLearning.jsx";
import Login from "./Login.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning" element={<MyLearning />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;