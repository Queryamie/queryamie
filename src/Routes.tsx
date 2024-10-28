import React from "react";
import { Routes, Route } from "react-router-dom";

import QueryAmi from "./pages/QueryAmi";




const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<QueryAmi />} />
    </Routes>
  );
};

export default AppRoutes;
