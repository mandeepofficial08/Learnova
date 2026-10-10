import { useEffect, useRef, useState } from "react";
import "./Explore.css";
import { useNavigate } from "react-router-dom";
import {
  Play,
  NotebookPen,
  Activity,
} from "lucide-react";
function getLoggedInUser() {
  try {
    const storedUser =
      localStorage.getItem("learnovaUser") ||
      sessionStorage.getItem("learnovaUser");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}
function Explore() {
  const [selectedTopic, setSelectedTopic] = useState("Web Development");
  const [selectedResource, setSelectedResource] = useState(0);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const exploreRef = useRef(null);
  const [showExplore, setShowExplore] = useState(false);


  /* =================================
   LOAD COURSES FROM LEANOVA DATABASE
================================= */

  useEffect(() => {
    fetch("http://localhost/Learnova_backend/courses.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        return response.json();
      })
      .then((data) => {
        if (!data.success || !Array.isArray(data.courses)) {
          throw new Error("Invalid course data");
        }

        setCourses(data.courses);
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


  /* =================================
     LEARNING RESOURCES
  ================================= */

  const resources = [
    {
      number: "01",
      type: "WATCH",
      title: "Video lessons",
      description:
        "Watch lessons, learn new concepts, and revisit videos whenever you need.",
      action: "Watch",
      icon: <Play />,
    },
    {
      number: "02",
      type: "READ",
      title: "Notes & explanations",
      description:
        "Read course notes and explanations to revise important concepts.",
      action: "Read",
      icon: <NotebookPen />,
    },
    {
      number: "03",
      type: "ACTIVITY",
      title: "Check Activity",
      description:
        "Check your total time spent, learning activity, and overall progress.",
      action: "Check",
      icon: <Activity />,
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
          className={`explore-search ${searchOpen ? "search-open" : ""
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
                      setSelectedCourse(course);
                      setSelectedTopic(course.title);
                      setSelectedResource(0);
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
          LEARNING CONTENT
      ================================= */}

      <div className="resource-section">
        <div className="resource-topic">
          <span className="resource-label">
            SELECTED TOPIC
          </span>

          <h2>
            {(selectedCourse?.title || selectedTopic).toUpperCase()}
          </h2>
          <p>Start wherever you want.</p>
        </div>

        <div className="resource-list">
          {resources.map((resource, index) => {
            const isSelected = selectedResource === index;

            return (
              <button
                key={resource.title}
                className={`resource-item ${isSelected ? "selected" : ""
                  }`}
                style={{
                  "--resource-delay": `${0.15 + index * 0.08
                    }s`,
                }}
                onClick={() => {
                  const courseToOpen =
                    selectedCourse ||
                    courses.find(
                      (course) =>
                        course.title?.toLowerCase() ===
                        selectedTopic.toLowerCase()
                    );

                  const user = getLoggedInUser();

                  if (user && courseToOpen?.id) {
                    navigate(`/user/courses/${courseToOpen.id}`);
                  } else {
                    navigate("/coursedetail", {
                      state: {
                        course: courseToOpen || {
                          title: selectedTopic,
                          category: selectedTopic,
                        },
                      },
                    });
                  }
                }}
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