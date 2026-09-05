import "./Hero.css";
import hero from "./assets/hero.png";

function Hero() {
  return (
    <section className="hero" id="home">

      <img
        className="hero-image"
        src={hero}
        alt="Learning"
      />

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <h1>Welcome to Learnify</h1>

        <p>
          Your journey to knowledge starts here.
        </p>

        <button className="hero-btn">
          Get Started
        </button>

      </div>

    </section>
  );
}

export default Hero;