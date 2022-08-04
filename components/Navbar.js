import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link href="/" >
        <a className="navButton">Home</a>
      </Link>
      <Link href="/filePage">
        <a className="navButton">File Upload</a>
      </Link>
      <Link href="/about">
        <a className="navButton">About</a>
      </Link>
    </div>
  );
};

export default Navbar;
