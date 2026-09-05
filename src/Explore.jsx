import { useEffect, useRef, useState } from "react";
import "./Explore.css";

function Explore() {
  const [selectedTopic, setSelectedTopic] = useState("Web Development");
  const [selectedResource, setSelectedResource] = useState(0);

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const exploreRef = useRef(null);
  const [showExplore, setShowExplore] = useState(false);

  /* =================================
     LOAD COURSES FROM API
  ================================= */

  useEffect(() => {
    fetch(
      "https://6a62f4a71bffb2ffab8b8e77.mockapi.io/api/v1/courses"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        return response.json();
      })
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error("Course API error:", error);
      });
  }, []);

  /* =================================
     EXPLORE ENTRANCE ANIMATION
  ================================= */

  useEffect(() => {
    const section = exploreRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowExplore(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* =================================
     TOPICS
  ================================= */

  const topics = [
    "Web Development",
    "Programming",
    "Databases",
    "Networks",
    "Data Structures",
    "Operating Systems",
  ];

  /* =================================
     LEARNING RESOURCES
  ================================= */

  const resources = [
    {
      number: "01",
      type: "WATCH",
      title: "Video lessons",
      description:
        "Learn visually through short explanations you can pause, replay and come back to later.",
      action: "Watch",
      icon: "▷",
    },
    {
      number: "02",
      type: "READ",
      title: "Notes & explanations",
      description:
        "Keep the important concepts close. Read through them whenever you need a quick refresher.",
      action: "Read",
      icon: "▱",
    },
    {
      number: "03",
      type: "PRACTICE",
      title: "Practice questions",
      description:
        "See whether you can actually use what you just learned by solving practical questions.",
      action: "Practice",
      icon: "⌁",
    },
    {
      number: "04",
      type: "TEST",
      title: "Quick quizzes",
      description:
        "Find out what you remember before moving ahead with a short knowledge check.",
      action: "Test",
      icon: "⌕",
    },
    {
      number: "05",
      type: "THINK",
      title: "Puzzles",
      description:
        "Problems that make you stop and think a little harder about what you have learned.",
      action: "Solve",
      icon: "♧",
    },
    {
      number: "06",
      type: "PLAY",
      title: "Learning games",
      description:
        "Practice without making it feel like another assignment. Learn through small challenges.",
      action: "Play",
      icon: "⌘",
    },
  ];

  /* =================================
     SEARCH COURSES FROM API
  ================================= */

  const filteredCourses = courses.filter((course) => {
    const title = String(course.title || "").toLowerCase();
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return title.includes(query);
  });

  const visibleCourses = showAll
    ? filteredCourses
    : filteredCourses.slice(0, 5);

  return (
    <section
      ref={exploreRef}
      className={`explore-page ${showExplore ? "show" : ""}`}
      id="explore"
    >
      {/* =================================
          HEADER
      ================================= */}

      <div className="explore-header">
        <div className="explore-heading">
          <span className="explore-label">EXPLORE</span>

          <h1>
            What are you curious
            <br />
            about?
          </h1>

          <p className="explore-mobile-intro">
            Browse a topic or follow whatever catches your attention.
          </p>
        </div>

        {/* =================================
            THREE STUDY CARDS
        ================================= */}

        <div className="study-cards">
          <div className="study-card study-card-html">
            <small>01 / MARKUP</small>
            <strong>HTML</strong>
          </div>

          <div className="study-card study-card-logic">
            <small>02 / LOGIC</small>
            <strong>Logic</strong>
          </div>

          <div className="study-card study-card-sql">
            <small>03 / DATA</small>
            <strong>SQL</strong>
          </div>
        </div>

        <p className="explore-intro">
          Browse a topic or follow whatever catches your attention.
        </p>
      </div>

      {/* =================================
          COURSE SEARCH
      ================================= */}

      <div className="explore-search-area">
        <div
          className={`explore-search ${
            searchOpen ? "search-open" : ""
          }`}
        >
          <input
            type="text"
            value={search}
            placeholder="Search your next topic..."
            onChange={(e) => {
              const value = e.target.value;

              setSearch(value);
              setShowAll(false);

              /*
                Suggestions ONLY appear after
                the user starts typing.
              */
              if (value.trim().length > 0) {
                setSearchOpen(true);
              } else {
                setSearchOpen(false);
              }
            }}
          />

          <span className="search-icon">⌕</span>
        </div>

        {/* =================================
            COURSE SUGGESTIONS
        ================================= */}

        {searchOpen && search.trim() !== "" && (
          <div className="course-results">
            {filteredCourses.length > 0 ? (
              <div className="course-results-list">
                {visibleCourses.map((course) => (
                  <button
                    className="course-result"
                    key={course.id}
                    onClick={() => {
                      setSearch(course.title);
                      setSearchOpen(false);
                    }}
                  >
                    <span className="course-result-title">
                      {course.title}
                    </span>

                    <span className="course-result-arrow">
                      →
                    </span>
                  </button>
                ))}

                {filteredCourses.length > 5 && !showAll && (
                  <button
                    className="show-all-btn"
                    onClick={() => setShowAll(true)}
                  >
                    <span>Show All</span>
                    <span>↓</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="no-course-result">
                No course found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* =================================
          TOPICS
      ================================= */}

      <div className="topic-section">
        <div className="topic-heading">
          <span>BROWSE</span>
        </div>

        <div className="topic-list">
          {topics.map((topic, index) => (
            <div className="topic-wrapper" key={topic}>
              {index !== 0 && (
                <span className="topic-dot">·</span>
              )}

              <button
                className={`topic-btn ${
                  selectedTopic === topic ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedTopic(topic);
                  setSelectedResource(0);
                }}
              >
                {topic}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* =================================
          LEARNING CONTENT
      ================================= */}

      <div className="resource-section">
        <div className="resource-topic">
          <span className="resource-label">
            SELECTED TOPIC
          </span>

          <h2>
            {selectedTopic === "Web Development"
              ? "WEB DEVELOPMENT"
              : selectedTopic.toUpperCase()}
          </h2>

          <p>Start wherever you want.</p>
        </div>

        <div className="resource-list">
          {resources.map((resource, index) => {
            const isSelected = selectedResource === index;

            return (
              <button
                key={resource.title}
                className={`resource-item ${
                  isSelected ? "selected" : ""
                }`}
                style={{
                  "--resource-delay": `${
                    0.15 + index * 0.08
                  }s`,
                }}
                onClick={() => setSelectedResource(index)}
              >
                <div className="resource-number">
                  {resource.number}
                </div>

                <div className="resource-icon">
                  {resource.icon}
                </div>

                <div className="resource-main">
                  <span className="resource-type">
                    {resource.type}
                  </span>

                  <h3>{resource.title}</h3>

                  <p>{resource.description}</p>

                  <div className="resource-extra">
                    <span>
                      Selected · Ready to{" "}
                      {resource.action.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="resource-action">
                  <span>{resource.action}</span>
                  <strong>→</strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Explore;