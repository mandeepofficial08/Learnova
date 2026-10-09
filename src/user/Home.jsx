
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Target,
  UserRound,
  Mail,
  Sparkles,  Trophy,

  Clock3,
} from "lucide-react";
import "./Home.css";

function Home() {
  const storedUser =
    localStorage.getItem("learnovaUser") ||
    sessionStorage.getItem("learnovaUser");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const name = user?.name || "Learner";
  const email = user?.email || "No email available";
  const firstLetter = name.charAt(0).toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="user-home">
      <div className="home-glow glow-one"></div>
      <div className="home-glow glow-two"></div>

      <div className="home-dashboard">

        {/* GREETING + PROFILE */}
        <div className="main-grid">

          {/* LEFT — BIG MESSAGE CARD */}
          <section className="message-card">

            <div className="message-card-top">
              <span className="card-label">WELCOME BACK</span>

              
            </div>

            <div className="message-content">
              <p>{getGreeting()},</p>

              <h1>{name}</h1>

              <span>
                Welcome back to Learnova.
                <br />
                {/* Ready to continue your learning journey? */}
              </span>
            </div>

          </section>

          {/* RIGHT — SMALL PROFILE CARD */}
          <section className="profile-small-card">

            <Link to="/user/settings" className="profile-arrow">
              <ArrowUpRight size={17} />
            </Link>

            <div className="avatar-small">
              {user?.avatar || user?.profileImage ? (
                <img
                  src={user.avatar || user.profileImage}
                  alt={name}
                />
              ) : (
                <span>{firstLetter}</span>
              )}
            </div>

            <div className="small-profile-info">
              <h2>{name}</h2>
              <p>{email}</p>
            </div>

          </section>
        </div>

        {/* THREE CARDS */}
        <div className="three-cards">

          <Link to="/user/tracking" className="mini-card pick-card">
            <div className="mini-card-top">
              <span>Pick up</span>

              <div className="mini-arrow">
                <ArrowUpRight size={17} />
              </div>
            </div>

            <div className="mini-card-bottom">
              <BookOpen size={22} />
              <h3>Continue learning</h3>
            </div>
          </Link>

          <Link to="/explore" className="mini-card explore-card">
            <div className="mini-card-top">
              <span>Explore</span>

              <div className="mini-arrow">
                <ArrowUpRight size={17} />
              </div>
            </div>

            <div className="mini-card-bottom">
              <Compass size={22} />
              <h3>Discover something new</h3>
            </div>
          </Link>

          <Link to="/user/courses" className="mini-card goal-card">
            <div className="mini-card-top">
              <span>Goal</span>

              <div className="mini-arrow">
                <ArrowUpRight size={17} />
              </div>
            </div>

            <div className="mini-card-bottom">
              <Target size={22} />
              <h3>Build your learning habit</h3>
            </div>
          </Link>

        </div>

        {/* BOTTOM */}
        <div className="bottom-cards">

          <div className="bottom-card">
          

           <Link
  to="/user/achievements"
  className="bottom-card achievements-card"
>
  <div className="bottom-card-icon">
    <Trophy size={19} />
  </div>

  <div>
    <span>Achievements</span>
    <h3>View your learning achievements.</h3>
  </div>

  <ArrowUpRight size={20} />
</Link>
          </div>

          <Link
            to="/user/settings"
            className="bottom-card settings-card"
          >
            <div>
              <span>Profile</span>
              <h3>Manage your account details.</h3>
            </div>

            <ArrowUpRight size={20} />
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Home;
