import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer-cft">
      <p id="footer-text-cft">
        Copyright © {currentYear} Software Development Cell, VIT, Chennai-600 127.
      </p>
    </footer>
  );
}

export default Footer;
