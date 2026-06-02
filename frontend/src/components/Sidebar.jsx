import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/orders", label: "Orders", icon: "📋" },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar content */}
      <aside 
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <nav className="flex flex-col py-4 h-full overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;
