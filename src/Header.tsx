import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Kiểm tra xem token có tồn tại trong localStorage hay không
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Xóa token khỏi localStorage để đăng xuất
    localStorage.removeItem("token");
    // Điều hướng người dùng đến trang login hoặc trang chủ sau khi logout
    window.location.href = "/login"; // Hoặc dùng navigate trong React Router nếu cần
  };

  return (
    <div className="flex flex-wrap justify-between items-center p-4 bg-white border-b-2 border-gray-300">
      {/* Logo and School Info */}
      <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
        <img src="/public/logo.png" alt="Logo" className="w-16 sm:w-20 mr-4" />
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-900 mb-1">
            TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI
          </h1>
          <span className="text-sm sm:text-lg text-yellow-500 tracking-wider">
            UNIVERSITY OF TRANSPORT AND COMMUNICATIONS
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="hidden sm:flex space-x-4">
        <a
          href="/"
          className="relative text-gray-800 text-sm sm:text-base px-2 py-1 rounded transition-all duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
        >
          Home
        </a>
        <a
          href="/3dmap"
          className="relative text-gray-800 text-sm sm:text-base px-2 py-1 rounded transition-all duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
        >
          360 Walk Through
        </a>
        {token ? (
          <a
            href="#"
            onClick={handleLogout}
            className="relative text-gray-800 text-sm sm:text-base px-2 py-1 rounded transition-all duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Logout
          </a>
        ) : (
          <a
            href="/login"
            className="relative text-gray-800 text-sm sm:text-base px-2 py-1 rounded transition-all duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Login
          </a>
        )}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-gray-800 text-2xl">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col items-start space-y-2 mt-4 sm:hidden">
          <a
            href="/"
            className="relative text-gray-800 text-sm px-2 py-1 rounded transition-all duration-300 hover:text-blue-600"
          >
            Home
          </a>
          <a
            href="/3dmap"
            className="relative text-gray-800 text-sm px-2 py-1 rounded transition-all duration-300 hover:text-blue-600"
          >
            360 Walk Through
          </a>
          {token ? (
            <a
              href="#"
              onClick={handleLogout}
              className="relative text-gray-800 text-sm px-2 py-1 rounded transition-all duration-300 hover:text-blue-600"
            >
              Logout
            </a>
          ) : (
            <a
              href="/login"
              className="relative text-gray-800 text-sm px-2 py-1 rounded transition-all duration-300 hover:text-blue-600"
            >
              Login
            </a>
          )}
        </div>
      )}
    </div>
  );
}
export default Header;
