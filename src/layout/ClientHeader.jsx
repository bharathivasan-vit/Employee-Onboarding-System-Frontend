import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function ClientHeader() {
  return (
    <div className="layout-container" id="layout-container-cl">
      <Header />
      <main className="main-content" id="main-content-cl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClientHeader;
