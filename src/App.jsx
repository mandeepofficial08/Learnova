
import Navbar from "./NavBar.jsx";
import Home from "./Home.jsx";
import MyLearning from "./MyLearning.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import UserLayout from "./user/UserLayout.jsx";
import UserHome from "./user/Home.jsx";
import Tracking from "./user/Tracking.jsx";
import Courses from "./user/Courses.jsx";
import Achievements from "./user/Achievements.jsx";
import Settings from "./user/Settings.jsx";
import CourseDetails from "./user/CourseDetails.jsx";
import VideoPage from "./user/VideoPage.jsx";
import NotesPages from "./user/NotesPages.jsx";
import TopicPage from "./user/TopicPage.jsx";
import ResourcePage from "./user/ResourcePage.jsx";
import ScrollRestoration from "./ScrollRestoration";
import GuestCourseDetail from "./CourseDetail.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Explore from "./Explore.jsx";

function ProtectedRoute({ children }) {
  const user =
    localStorage.getItem("learnovaUser") ||
    sessionStorage.getItem("learnovaUser");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/user");

  return (
    <div className="App">

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/learning" element={<MyLearning />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/MyLearning" element={<MyLearning />} />
        <Route
          path="/coursedetail"
          element={<GuestCourseDetail />}
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserHome />} />

          <Route path="tracking" element={<Tracking />} />

          <Route path="courses" element={<Courses />} />

          <Route
            path="courses/:courseId"
            element={<CourseDetails />}
          />
          <Route
            path="courses/:courseId/topic/:topicId"
            element={<TopicPage />}
          />
          <Route
            path="resource/:resourceUrl"
            element={<ResourcePage />}
          />
          <Route path="video/:videoUrl" element={<VideoPage />} />
          <Route
            path="notes/:notesUrl"
            element={<NotesPages />}
          />

          <Route path="achievements" element={<Achievements />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollRestoration />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
