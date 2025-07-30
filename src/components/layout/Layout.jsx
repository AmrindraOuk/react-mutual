import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl">My Layout Header</h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4">
        <p>My Layout Footer</p>
      </footer>
    </div>
  );
};

export default Layout;
