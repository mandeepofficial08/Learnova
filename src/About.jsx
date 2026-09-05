import "./About.css";

function About() {
  return (
    <div
  id="about"
  className={`about-page ${showAbout ? "show" : ""}`}
>

      {/* Hero */}
      <section className="about-hero">
        <p className="about-label">ABOUT LEARNOVA</p>

        <h1>
          Learning should feel
          <span> simple.</span>
        </h1>

        <p className="about-intro">
          Learnova is an e-learning platform designed to make
          learning more organized, accessible, and enjoyable.
          Find what you want to learn, learn at your own pace,
          and keep track of your progress along the way.
        </p>
      </section>


      {/* Our Purpose */}
      <section className="about-section">

        <div className="about-section-title">
          <span>01</span>
          <h2>Why Learnova?</h2>
        </div>

        <div className="about-section-content">
          <p>
            Learning online can sometimes feel overwhelming.
            There are countless courses, resources, and topics
            to choose from.
          </p>

          <p>
            Learnova brings everything into one simple space,
            helping learners discover courses, build their
            knowledge, and stay consistent with their learning.
          </p>
        </div>

      </section>


      {/* What We Offer */}
      <section className="about-section">

        <div className="about-section-title">
          <span>02</span>
          <h2>What we offer</h2>
        </div>

        <div className="about-cards">

          <div className="about-card">
            <span>01</span>
            <h3>Explore</h3>
            <p>
              Discover courses and topics that match
              your interests and learning goals.
            </p>
          </div>

          <div className="about-card">
            <span>02</span>
            <h3>Learn</h3>
            <p>
              Study at your own pace with resources
              designed to make learning easier.
            </p>
          </div>

          <div className="about-card">
            <span>03</span>
            <h3>Track</h3>
            <p>
              Keep an eye on your progress and continue
              building your learning journey.
            </p>
          </div>

        </div>

      </section>


      {/* Mission */}
      <section className="about-mission">

        <p className="about-label">OUR APPROACH</p>

        <h2>
          Learn something new.
          <br />
          Keep moving forward.
        </h2>

        <p>
          Whether you're starting from the basics or improving
          skills you already have, Learnova is built to help you
          keep learning without making the process complicated.
        </p>

      </section>

    </div>
  );
}

export default About;