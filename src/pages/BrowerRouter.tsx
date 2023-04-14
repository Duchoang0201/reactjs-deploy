import React from "react";
import { Route, Routes } from "react-router-dom";
import CategoryCRUD from "./categoryCRUD";
import CustomerCRUD from "./CustomerCRUD";
import EmployeesCRUD from "./EmployeesCRUD";
import Navigation from "./Navigation";
import ProductsCRUD from "./ProductsCRUD";
import SupperliersCRUD from "./SupperliersCRUD";

function Browser() {
  return (
    <>
      <Navigation></Navigation>
      <Routes>
        <Route path="/categories" element={<CategoryCRUD />}>
          {" "}
        </Route>
        <Route path="/suppliers" element={<SupperliersCRUD />}>
          {" "}
        </Route>
        <Route path="/customers" element={<CustomerCRUD />}>
          {" "}
        </Route>
        <Route path="/employees" element={<EmployeesCRUD />}>
          {" "}
        </Route>
        <Route path="/products" element={<ProductsCRUD />}>
          {" "}
        </Route>
        <Route path="/products" element={<ProductsCRUD />}>
          {" "}
        </Route>
      </Routes>
    </>
  );
}

export default Browser;
