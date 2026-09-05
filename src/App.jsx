import Navbar from "./NavBar.jsx";
import Home from "./Home.jsx";
import MyLearning from "./MyLearning.jsx";

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;