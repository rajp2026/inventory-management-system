const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          className="h-7 w-7 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
        <span className="text-xl font-bold text-indigo-600">Inventory</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
        <span className="text-sm font-semibold text-indigo-600">A</span>
      </div>
    </nav>
  );
};
export default Navbar;
