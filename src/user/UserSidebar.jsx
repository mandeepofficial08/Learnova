
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./UserSidebar.css";

function UserSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const renderNavigation = () => (
    <nav className="sidebar-nav">
      <NavLink to="/user" end onClick={closeMenu}>
        Home
      </NavLink>

      <NavLink to="/user/courses" onClick={closeMenu}>
        Courses
      </NavLink>

      <NavLink to="/user/tracking" onClick={closeMenu}>
        Tracking
      </NavLink>

      <NavLink to="/user/settings" onClick={closeMenu}>
        Settings
      </NavLink>
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        aria-controls="user-sidebar"
      >
        <Menu size={25} />
      </button>

      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        id="user-sidebar"
        className={`user-sidebar ${menuOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-mobile-header">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Learnova" />
          </div>

          <button
            type="button"
            className="sidebar-close-button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <X size={23} />
          </button>
        </div>

        <div className="sidebar-desktop-logo sidebar-logo">
          <img src="/logo.png" alt="Learnova" />
        </div>

        {renderNavigation()}
      </aside>
    </>
  );
}

export default UserSidebar;
