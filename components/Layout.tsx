import React from "react";
import Link from "next/link";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="page">
      <Link href="/">
        <a>
          <img src="/logo.png" alt="logo" />
        </a>
      </Link>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
