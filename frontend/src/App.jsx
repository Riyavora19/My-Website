import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import RaiseIssue from "./Components/RaiseIssue";
import Navbar from "./Components/Navbar";
import TrackStatus from "./Components/TrackStatus";
import SubmitFeedback from "./Components/SubmitFeedback";
import Features from "./Components/Features";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Profile from "./Components/Profile";
import AdminPanel from "./Components/Admin Panel/AdminPanel";

function App() {
  return (
    <BrowserRouter>

     <Navbar/> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/raise-issue" element={<RaiseIssue />} />
         <Route path="/track-status" element={<TrackStatus />} />
         <Route path="/submit-feedback" element={<SubmitFeedback />} />
         <Route path="/features" element={<Features/>}/>
         <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


