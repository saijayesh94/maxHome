import React from "react";
import CreateNewOfferCard from "./CreateNewOfferCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChartUI from "./pages/ChartUI";
import ViewAndEditButton from "../src/components/ChatBody/ViewAndEditButton";
import NavBar from "./components/NavBar";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<CreateNewOfferCard />} />
        <Route path="/chat-ui" element={<ChartUI />} />
        <Route path="/edit-offer" element={<ViewAndEditButton />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
