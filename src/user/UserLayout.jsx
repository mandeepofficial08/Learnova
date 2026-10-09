import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

function UserLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      <UserSidebar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

    </div>
  );
}

export default UserLayout;