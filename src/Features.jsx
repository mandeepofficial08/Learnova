import { useEffect, useRef, useState } from "react";
import "./Features.css";
import {
  Video,
  NotebookPen,
  ChartNoAxesColumn,
  Map
} from "lucide-react";
function Features() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState("Video Lessons");

  const features = [
    {
      title: "Video Lessons",
      icon: <Video />,
      description:
        "Learn through structured video lessons that explain concepts clearly and step by step. Pause, replay, and learn at your own pace.",
    },
    {
      title: "Notes & Resources",
      icon: <NotebookPen />,
      description:
        "Get useful notes, summaries, and learning resources alongside your lessons so you can revise important concepts whenever you need.",
    },
    {
      title: "Track Your Progress",
      icon: <ChartNoAxesColumn />,
      description:
        "Keep track of completed lessons, quiz scores, learning time, and overall course progress so you always know how far you've come.",
    },
    {
      title: "Learning Roadmaps",
      icon: <Map />,
      description:
        "Follow structured learning roadmaps that show you what to learn next and help you move from the basics toward more advanced topics.",
    },
  ];

  const selectedFeature = features.find(
    (feature) => feature.title === activeFeature
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`features-section ${visible ? "show" : ""}`}
      id="features"
      ref={sectionRef}
    >
      <div className="features-container">

        {/* LEFT SIDE */}
        <div className="features-left">
          <p className="features-small-title">LEARN BETTER</p>

          <h2>
            Everything You
            <br />
            Need to <span>Learn</span>
          </h2>

          <p className="features-intro">
            Learnify brings everything together in one place — lessons,
            resources, practice, games, and tools to help you learn
            consistently.
          </p>

          <div className="feature-list">
            {features.map((feature, index) => (
              <button
                key={feature.title}
                className={`feature-card ${
                  activeFeature === feature.title ? "selected" : ""
                }`}
                style={{
                  "--delay": `${index * 0.08}s`,
                }}
                onClick={() => setActiveFeature(feature.title)}
              >
                <span className="feature-icon">{feature.icon}</span>

                <span className="feature-title">
                  {feature.title}
                </span>

                <span className="feature-arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="features-right">
          <div className="feature-description">

            <div className="description-icon">
              {selectedFeature.icon}
            </div>

            <p className="description-label">
              FEATURE
            </p>

            <h3>{selectedFeature.title}</h3>

            <p className="description-text">
              {selectedFeature.description}
            </p>

            <div className="description-line"></div>

            <p className="description-hint">
              Select another feature to explore more →
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;