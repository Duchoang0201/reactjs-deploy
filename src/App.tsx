import React from "react";
import { BrowserRouter } from "react-router-dom";
import Browser from "./pages/BrowerRouter";

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Browser />
      </BrowserRouter>
    </>
  );
};

export default App;
