import { useState, useRef, useEffect } from "react";
import "./NavBar.css";
import logo from "./assets/logo.png";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function NavBar() {
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const navRef = useRef(null);

  // This prevents the scroll listener from
  // changing the active link while we are
  // doing a smooth scroll from a navbar click.
  const autoScrollingRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [pillStyle, setPillStyle] = useState({
    left: 0,
    width: 0,
  });

  // --------------------------------
  // Navigation links
  // --------------------------------

  const links = isLoggedIn
    ? [
        "Home",
        "Explore",
        "My Learning",
        "About",
        "Contact Us",
        "Profile",
      ]
    : [
        "Home",
        "Explore",
        "About",
        "Contact Us",
      ];

  // --------------------------------
  // Detect current section
  // --------------------------------

  useEffect(() => {
    if (location.pathname !== "/") {
      if (location.pathname === "/learning") {
        setActive("My Learning");
      }

      if (location.pathname === "/profile") {
        setActive("Profile");
      }

      return;
    }

    const handleScroll = () => {
      // IMPORTANT:
      // Don't change the active link while
      // navbar-triggered smooth scrolling
      // is happening.
      if (autoScrollingRef.current) {
        return;
      }

      const explore =
        document.getElementById("explore");

      const about =
        document.getElementById("about");

      const contact =
        document.getElementById("contact");

      const scrollPosition =
        window.scrollY + 150;

      if (
        contact &&
        scrollPosition >= contact.offsetTop
      ) {
        setActive("Contact Us");
      }

      else if (
        about &&
        scrollPosition >= about.offsetTop
      ) {
        setActive("About");
      }

      else if (
        explore &&
        scrollPosition >= explore.offsetTop
      ) {
        setActive("Explore");
      }

      else {
        setActive("Home");
      }
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [location.pathname]);

  // --------------------------------
  // Move active pill
  // --------------------------------

  useEffect(() => {
    const updatePill = () => {
      const nav = navRef.current;

      if (!nav) return;

      const activeLink =
        nav.querySelector(
          ".nav-link.active"
        );

      if (!activeLink) return;

      const navRect =
        nav.getBoundingClientRect();

      const linkRect =
        activeLink.getBoundingClientRect();

      setPillStyle({
        left:
          linkRect.left -
          navRect.left,
        width: linkRect.width,
      });
    };

    updatePill();

    window.addEventListener(
      "resize",
      updatePill
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePill
      );
    };
  }, [
    active,
    isLoggedIn,
  ]);

  // --------------------------------
  // Smooth scroll function
  // --------------------------------

  const scrollToSection = (id) => {
    const section =
      document.getElementById(id);

    if (!section) return;

    autoScrollingRef.current = true;

    // Set the active link immediately.
    // The pill will now move directly to
    // the clicked link.
    
    if (id === "explore") {
      setActive("Explore");
    }

    if (id === "about") {
      setActive("About");
    }

    if (id === "contact") {
      setActive("Contact Us");
    }

    const navbarHeight = 80;

    const targetPosition =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Keep the scroll listener disabled
    // while the smooth scroll is happening.
    setTimeout(() => {
      autoScrollingRef.current = false;

      // Make sure the clicked section
      // remains active after scrolling.
      if (id === "explore") {
        setActive("Explore");
      }

      if (id === "about") {
        setActive("About");
      }

      if (id === "contact") {
        setActive("Contact Us");
      }
    }, 700);
  };

  // --------------------------------
  // Handle navigation
  // --------------------------------

  const handleNavigation = (e, link) => {
    e.preventDefault();

    setMenuOpen(false);

    // ------------------------------
    // HOME
    // ------------------------------

    if (link === "Home") {
      setActive("Home");

      autoScrollingRef.current = true;

      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 50);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        autoScrollingRef.current = false;
        setActive("Home");
      }, 700);

      return;
    }

    // ------------------------------
    // EXPLORE
    // ------------------------------

    if (link === "Explore") {
      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          scrollToSection("explore");
        }, 100);
      } else {
        scrollToSection("explore");
      }

      return;
    }

    // ------------------------------
    // ABOUT
    // ------------------------------

    if (link === "About") {
      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          scrollToSection("about");
        }, 100);
      } else {
        scrollToSection("about");
      }

      return;
    }

    // ------------------------------
    // CONTACT US
    // ------------------------------

    if (link === "Contact Us") {
      if (location.pathname !== "/") {
        navigate("/");

        setTimeout(() => {
          scrollToSection("contact");
        }, 100);
      } else {
        scrollToSection("contact");
      }

      return;
    }

    // ------------------------------
    // MY LEARNING
    // ------------------------------

    if (link === "My Learning") {
      setActive("My Learning");

      navigate("/learning");

      return;
    }

    // ------------------------------
    // PROFILE
    // ------------------------------

    if (link === "Profile") {
      setActive("Profile");

      navigate("/profile");

      return;
    }
  };

  // --------------------------------
  // Login
  // --------------------------------

  const handleLogin = () => {
    setMenuOpen(false);

    navigate("/login");
  };

  // --------------------------------
  // Logout
  // --------------------------------

  const handleLogout = () => {
    setIsLoggedIn(false);

    setActive("Home");

    setMenuOpen(false);

    navigate("/");

    autoScrollingRef.current = true;

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);

    setTimeout(() => {
      autoScrollingRef.current = false;
      setActive("Home");
    }, 700);
  };

  // --------------------------------
  // Links
  // --------------------------------

  const getHref = (link) => {
    if (link === "Home") {
      return "/";
    }

    if (link === "Explore") {
      return "/#explore";
    }

    if (link === "My Learning") {
      return "/learning";
    }

    if (link === "About") {
      return "/#about";
    }

    if (link === "Contact Us") {
      return "/#contact";
    }

    if (link === "Profile") {
      return "/profile";
    }

    return "#";
  };

  // --------------------------------
  // JSX
  // --------------------------------

  return (
    <nav className="navbar">

      {/* LOGO */}

      <div className="logo">
        <img
          src={logo}
          alt="Learnova Logo"
        />
      </div>

      {/* DESKTOP NAVIGATION */}

      <div
        className="nav-menu"
        ref={navRef}
      >

        {/* MOVING ACTIVE PILL */}

        <span
          className="active-pill"
          style={{
            left: `${pillStyle.left}px`,
            width: `${pillStyle.width}px`,
          }}
        ></span>

        {links.map((link) => (
          <a
            key={link}
            href={getHref(link)}
            className={`nav-link ${
              active === link
                ? "active"
                : ""
            }`}
            onClick={(e) =>
              handleNavigation(
                e,
                link
              )
            }
          >
            {link}
          </a>
        ))}
      </div>

      {/* LOGIN / LOGOUT */}

      {!isLoggedIn ? (
        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>
      ) : (
        <button
          className="login-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      {/* HAMBURGER */}

      <button
        className={`hamburger ${
          menuOpen ? "open" : ""
        }`}
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MOBILE MENU */}

      <div
        className={`mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >

        {links.map((link) => (
          <button
            key={link}
            className={`mobile-link ${
              active === link
                ? "active"
                : ""
            }`}
            onClick={(e) =>
              handleNavigation(
                e,
                link
              )
            }
          >
            {link}
          </button>
        ))}

        {!isLoggedIn ? (
          <button
            className="mobile-login"
            onClick={handleLogin}
          >
            Login
          </button>
        ) : (
          <button
            className="mobile-login"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default NavBar;