import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import LatestPosts from "./components/LatestPosts";
import Manifesto from "./components/Manifesto";
import VideoSection from "./components/VideoSection";
import AuthorAndPicks from "./components/AuthorAndPicks";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

const Home = () => (
  <div className="min-h-screen bg-[var(--paper)] grain">
    <Navbar />
    <Hero />
    <Marquee />
    <LatestPosts />
    <Manifesto />
    <VideoSection />
    <AuthorAndPicks />
    <Newsletter />
    <Footer />
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
