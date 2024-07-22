import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { WelcomeInput } from "./components/welcomeInput";
import { Home } from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeInput />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
