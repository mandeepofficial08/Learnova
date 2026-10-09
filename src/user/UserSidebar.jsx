import { NavLink } from "react-router-dom";
import "./UserSidebar.css";

function UserSidebar() {
  return (
    <aside className="user-sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Learnova" />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/user" end>
          Home
        </NavLink>
         <NavLink to="/user/courses">
          Courses
        </NavLink>

        <NavLink to="/user/tracking">
          Tracking
        </NavLink>

       

        <NavLink to="/user/achievements">
          Achievements
        </NavLink>

        <NavLink to="/user/settings">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default UserSidebar;