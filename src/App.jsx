import React, { useState, useEffect } from "react";
import DeviceDashboard from "./pages/DeviceDashboard";
import { BsMoon, BsSun } from "react-icons/bs";
// ✅ Gunakan path absolut ke folder public (tanpa import)
const logo = "/Logo_Pusident.png";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* === HEADER === */}
      <header
        className={`flex justify-between items-center px-6 py-4 shadow-md sticky top-0 z-20 transition-all duration-500 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Pusident"
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain border-2 border-sky-400 shadow-md rounded-lg"
          />
          <h1 className="text-2xl font-bold tracking-wide whitespace-nowrap">
            Device Monitoring Dashboard
          </h1>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:scale-105 transition-all duration-300"
        >
          {theme === "dark" ? <BsSun size={18} /> : <BsMoon size={18} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* === MAIN === */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <DeviceDashboard />
      </main>

      {/* === FOOTER === */}
      <footer
        className={`text-center py-3 border-t text-sm ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-white text-gray-600"
        }`}
      >
        © {new Date().getFullYear()} Device Dashboard — All Rights Reserved.
      </footer>
    </div>
  );
}
