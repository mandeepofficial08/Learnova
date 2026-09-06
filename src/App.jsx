import Navbar from "./NavBar.jsx";
import Home from "./Home.jsx";
import MyLearning from "./MyLearning.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";


function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="App">

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<MyLearning />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;