
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Play,
  UnlockKeyhole,
} from "lucide-react";
import "./CourseDetails.css";

const API = "http://localhost/Learnova_backend";

function getUser() {
  try {
    const storedUser =
      localStorage.getItem("learnovaUser") ||
      sessionStorage.getItem("learnovaUser");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [courseResources, setCourseResources] = useState([]);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [completingCourse, setCompletingCourse] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [isLearning, setIsLearning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const inactivityTimer = useRef(null);

  useEffect(() => {
    fetch(`${API}/courses.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const foundCourse = data.courses.find(
            (item) => String(item.id) === String(courseId)
          );

          setCourse(foundCourse || null);
        }
      })
      .catch((error) => {
        console.error("Error fetching course:", error);
      });
  }, [courseId]);

  useEffect(() => {
    fetch(`${API}/resources.php?course_id=${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCourseResources(data.resources);
        }
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
      });
  }, [courseId]);

  useEffect(() => {
    const user = getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    fetch(
      `${API}/check_enrollment.php?user_id=${user.id}&course_id=${courseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.enrolled) {
          setEnrollment(data.enrollment);

          if (data.enrollment.status === "completed") {
            setCourseCompleted(true);
          }

          return fetch(
            `${API}/check_active_session.php?enrollment_id=${data.enrollment.id}`
          );
        }

        return null;
      })
      .then((response) => {
        if (!response) return null;
        return response.json();
      })
      .then((sessionData) => {
        if (sessionData?.active_session) {
          setSessionId(sessionData.session_id);
          setIsLearning(true);

          const startedAt = new Date(
            sessionData.started_at.replace(" ", "T")
          );

          const elapsedSeconds = Math.floor(
            (Date.now() - startedAt.getTime()) / 1000
          );

          setSessionTime(Math.max(0, elapsedSeconds));
        }
      })
      .catch((error) => {
        console.error("Error checking enrollment/session:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId]);

  useEffect(() => {
    if (!isLearning) return undefined;

    const timer = window.setInterval(() => {
      setSessionTime((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isLearning]);

  useEffect(() => {
    if (!isLearning) return undefined;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer.current);

      inactivityTimer.current = window.setTimeout(() => {
        stopLearning(true);
      }, 5 * 60 * 1000);
    };

    const events = [
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer.current);

      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [isLearning, sessionId]);

  const enrollCourse = () => {
    const user = getUser();

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    setEnrolling(true);
    setMessage("");

    fetch(`${API}/enroll.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        course_id: courseId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Course enrolled successfully.");

          setEnrollment({
            id: data.enrollment_id,
            status: "active",
          });

          setCourseCompleted(false);
        } else {
          setMessage(data.message || "Could not enroll in this course.");
        }
      })
      .catch((error) => {
        console.error("Error enrolling:", error);
        setMessage("Could not enroll in this course.");
      })
      .finally(() => {
        setEnrolling(false);
      });
  };

  const startLearning = () => {
    if (!enrollment) {
      setMessage("Please enroll in this course first.");
      return;
    }

    setMessage("");

    fetch(`${API}/start_session.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enrollment_id: enrollment.id,
      }),
    })
      .then(async (response) => {
        const text = await response.text();

        try {
          return JSON.parse(text);
        } catch {
          throw new Error("Invalid response from server: " + text);
        }
      })
      .then((data) => {
        if (data.success) {
          setSessionId(data.session_id);
          setIsLearning(true);
          setSessionTime(0);
        } else {
          setMessage(data.message || "Could not start learning.");
        }
      })
      .catch((error) => {
        console.error("Error starting learning session:", error);
        setMessage("Could not start learning session.");
      });
  };

  const stopLearning = (inactive = false) => {
    if (!sessionId) return;

    fetch(`${API}/stop_session.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsLearning(false);
          setSessionId(null);
          setSessionTime(0);

          setMessage(
            inactive
              ? "Learning session stopped due to 5 minutes of inactivity."
              : "Learning session completed."
          );
        } else {
          setMessage(data.message || "Could not stop the session.");
        }
      })
      .catch((error) => {
        console.error("Error stopping learning session:", error);
        setMessage("Could not stop learning session.");
      });
  };

  const handleCompleteCourse = async () => {
    if (!enrollment?.id || completingCourse || courseCompleted) {
      return;
    }

    setCompletingCourse(true);

    try {
      const response = await fetch(`${API}/complete_course.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enrollment_id: enrollment.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCourseCompleted(true);

        setEnrollment((previous) => ({
          ...previous,
          status: "completed",
        }));

        setMessage("Course marked as completed.");
      } else {
        setMessage(data.message || "Unable to complete course.");
      }
    } catch (error) {
      console.error("Error completing course:", error);
      setMessage("Unable to complete course.");
    } finally {
      setCompletingCourse(false);
    }
  };

  const formatSessionTime = () => {
    const hours = String(Math.floor(sessionTime / 3600)).padStart(2, "0");
    const minutes = String(
      Math.floor((sessionTime % 3600) / 60)
    ).padStart(2, "0");
    const seconds = String(sessionTime % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  if (loading || !course) {
    return (
      <main className="course-details-page">
        <div className="course-details-container course-details-loading">
          Preparing your course...
        </div>
      </main>
    );
  }

  return (
    <main className="course-details-page">
      <div className="course-details-container">
        <div className="course-details-topline">
          <button
            onClick={() => navigate(-1)}
            className="course-back-link"
          >
            ← Back to Courses
          </button>

          <span className="course-details-counter">
            COURSE {String(course.id).padStart(2, "0")}
          </span>
        </div>

        <section className="course-details-hero">
          <div className="course-details-hero-copy">
            <span className="course-details-eyebrow">
              YOUR LEARNING JOURNEY
            </span>

            <h1>
              {course.title}
              <br />
              <em>starts here.</em>
            </h1>

            <p>
              {course.description ||
                "Build your knowledge and learn at your own pace."}
            </p>
          </div>

          <div className="course-details-hero-stat">
            <BookOpen size={23} />
            <span>Course materials</span>
            <strong>{courseResources.length}</strong>
            <small>Resources available</small>
          </div>
        </section>

        <section className="course-action-section">
          {enrollment ? (
            <div className="learning-status-row">
              <div className="learning-status-main">
                <span className="course-section-label">
                  CURRENT ENROLLMENT
                </span>

                <h2>
                  <CheckCircle2 size={21} />
                  You're enrolled
                </h2>

                <div className="learning-meta">
                  <span>
                    <span className="active-status-dot" />
                    {enrollment.status}
                  </span>
                </div>
              </div>

              <div className="learning-action">
                {!courseCompleted &&
                  (!isLearning ? (
                    <button
                      className="learn-button"
                      onClick={startLearning}
                    >
                      <Play size={14} fill="currentColor" />
                      Start learning
                      <ArrowUpRight size={16} />
                    </button>
                  ) : (
                    <div className="active-learning-box">
                      <div>
                        <span className="active-learning-label">
                          LEARNING IN PROGRESS
                        </span>

                        <strong>
                          <Clock3 size={17} />
                          {formatSessionTime()}
                        </strong>
                      </div>

                      <button
                        className="stop-learning-button"
                        onClick={() => stopLearning(false)}
                      >
                        Stop learning
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="enrollment-panel">
              <div className="enrollment-copy">
                <span className="course-section-label">
                  START YOUR JOURNEY
                </span>

                <h2>Enroll in this course</h2>

                <p>
                  Enroll to access this course and its learning resources.
                </p>
              </div>

              <div className="goal-selection">
                <button
                  className="enroll-button"
                  onClick={enrollCourse}
                  disabled={enrolling}
                >
                  <UnlockKeyhole size={15} />
                  {enrolling ? "Enrolling..." : "Enroll now"}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="course-action-message">{message}</p>
          )}
        </section>

        <section className="course-resource-section">
          <div className="course-section-heading">
            <div>
              <span className="course-section-label">
                COURSE MATERIAL
              </span>

              <h2>Resources</h2>
            </div>

            <span className="course-section-count">
              {courseResources.length} available
            </span>
          </div>

          {courseResources.length > 0 ? (
            <div className="course-resource-list">
              {courseResources.map((resource) => (
                <button
                  key={resource.id}
                  className="course-resource-item"
                  onClick={() => {
                    if (
                      resource.type === "video" ||
                      resource.type === "playlist"
                    ) {
                      navigate(
                        `/user/video/${encodeURIComponent(resource.url)}`
                      );
                    } else if (resource.type === "pdf") {
                      navigate(
                        `/user/notes/${encodeURIComponent(resource.url)}`
                      );
                    } else {
                      window.open(
                        resource.url,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                >
                  <div>
                    <span>{resource.type}</span>
                    <strong>{resource.title}</strong>
                  </div>

                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          ) : (
            <p className="course-empty-message">
              No course-level resources available.
            </p>
          )}

          {enrollment && (
            <div className="course-completion">
              {courseCompleted ? (
                <div className="course-completed-message">
                  <CheckCircle2 size={19} />
                  <span>Course completed</span>
                </div>
              ) : (
                <button
                  className="course-complete-button"
                  onClick={handleCompleteCourse}
                  disabled={completingCourse}
                >
                  <Check size={17} />
                  {completingCourse
                    ? "Marking as completed..."
                    : "Mark course as completed"}
                </button>
              )}
            </div>
          )}
        </section>

        {enrollment && enrollment.status !== "completed" && (
          <Link
            to={`/user/tracking?course_id=${courseId}`}
            className="tracking-link"
          >
            <BarChart3 size={16} />
            View course tracking
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </main>
  );
}

export default CourseDetails;
