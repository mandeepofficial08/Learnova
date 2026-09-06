import { useEffect, useState } from "react";
import "./About.css";

function About() {
 const [showAbout, setShowAbout] = useState(false);
const [showMission, setShowMission] = useState(false);

  useEffect(() => {
    const section = document.getElementById("about");
const mission = document.querySelector(".about-mission");

const missionObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setShowMission(true);
      missionObserver.disconnect();
    }
  },
  {
    threshold: 0.2,
  }
);

if (mission) {
  missionObserver.observe(mission);
}
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowAbout(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (section) {
      observer.observe(section);
    }

   return () => {
  observer.disconnect();
  missionObserver.disconnect();
};
  }, []);

  return (
    <div id="about" className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <p className={`about-label ${showAbout ? "show" : ""}`}>
          ABOUT LEARNOVA
        </p>

        <h1 className={showAbout ? "show" : ""}>
          Learning should feel
          <span> simple.</span>
        </h1>

        <p className={`about-intro ${showAbout ? "show" : ""}`}>
          Learnova is an e-learning platform designed to make
          learning more organized, accessible, and enjoyable.
          Find what you want to learn, learn at your own pace,
          and keep track of your progress along the way.
        </p>
      </section>


      {/* Our Purpose */}
      <section className="about-section">

        <div className={`about-section-title ${showAbout ? "show" : ""}`}>
          <span>01</span>
          <h2>Why Learnova?</h2>
        </div>

        <div className={`about-section-content ${showAbout ? "show" : ""}`}>
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

        <div className={`about-section-title ${showAbout ? "show" : ""}`}>
          <span>02</span>
          <h2>What we offer</h2>
        </div>

        <div className="about-cards">

          <div className={`about-card ${showAbout ? "show" : ""}`}>
            <span>01</span>
            <h3>Explore</h3>
            <p>
              Discover courses and topics that match
              your interests and learning goals.
            </p>
          </div>

          <div className={`about-card ${showAbout ? "show" : ""}`}>
            <span>02</span>
            <h3>Learn</h3>
            <p>
              Study at your own pace with resources
              designed to make learning easier.
            </p>
          </div>

          <div className={`about-card ${showAbout ? "show" : ""}`}>
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

  <p className={`about-label ${showMission ? "show" : ""}`}>
    OUR APPROACH
  </p>

  <h2 className={showMission ? "show" : ""}>
    Learn something new.
    <br />
    Keep moving forward.
  </h2>

  <p className={showMission ? "show" : ""}>
    Whether you're starting from the basics or improving
    skills you already have, Learnova is built to help you
    keep learning without making the process complicated.
  </p>

</section>
    </div>
  );
}

export default About;