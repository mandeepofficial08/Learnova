import "./Footer.css";

function Footer() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className={`footer ${showFooter ? "show" : ""}`}>

      <div className="footer-top">
        <span>Keep learning</span>
        <span className="footer-dot">✦</span>
        <span>Keep growing</span>
      </div>

      <div className="footer-links">
        <p>© 2026 Learnova</p>

        <span>•</span>

        <button onClick={() => scrollToSection("explore")}>
          Explore
        </button>

        <span>•</span>

        <button onClick={() => scrollToSection("about")}>
          About
        </button>

        <span>•</span>

        <button onClick={() => scrollToSection("contact")}>
          Contact
        </button>

        <span>•</span>

        <button onClick={() => window.scrollTo({
          top: 0,
          behavior: "smooth"
        })}>
          Home
        </button>
      </div>

      <p className="footer-credit">
        Made with <span>♥</span> for curious minds
      </p>

    </footer>
  );
}

export default Footer;