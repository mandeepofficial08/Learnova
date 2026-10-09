
import { useEffect, useState } from "react";
import {
  BarChart3,
  Target,
  Flame,
  Clock3,
  Activity,
  ChevronDown,
} from "lucide-react";
import "./Tracking.css";

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

function Tracking() {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const getUser = () => {
    const storedUser =
      localStorage.getItem("learnovaUser") ||
      sessionStorage.getItem("learnovaUser");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  };

  const fetchTracking = (courseId = null) => {
    const user = getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    let url =
      `http://localhost/Learnova_backend/tracking.php?user_id=${user.id}`;

    if (courseId) {
      url += `&course_id=${courseId}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTracking(data);

          if (data.selected_course) {
            setSelectedCourseId(
              Number(data.selected_course.id)
            );
          }
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching tracking data:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const courseId = params.get("course_id");

    if (courseId) {
      fetchTracking(Number(courseId));
    } else {
      fetchTracking();
    }
  }, []);

  const handleCourseChange = (event) => {
    const courseId = Number(event.target.value);

    setSelectedCourseId(courseId);
    setCourseDropdownOpen(false);

    fetchTracking(courseId);
  };

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="tracking-container">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!tracking || !tracking.enrolled) {
    return (
      <div className="tracking-page">
        <div className="tracking-container">
          <h1>No active course</h1>

          <p>
            Enroll in a course to start tracking your
            learning.
          </p>
        </div>
      </div>
    );
  }

  // Last 7 days
  const today = new Date();

  const weekDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);

    date.setDate(today.getDate() - i);

    const dateKey = date.toISOString().split("T")[0];

    const dayName = date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      }
    );

    const activity =
      tracking.weekly_activity.find(
        (item) => item.date === dateKey
      );

    weekDays.push({
      date: dateKey,
      day: dayName,
      seconds: activity
        ? activity.seconds
        : 0,
    });
  }

  /*
    Chart percentage is based on the
    selected course's daily goal.
  */

  const goalSeconds =
    tracking.daily_goal_hours * 60 * 60;

  return (
    <div className="tracking-page">
      <div className="tracking-container">

        {/* Header */}

        <div className="tracking-header">

          <div>
            <span className="tracking-label">
              LEARNING
            </span>

            <h1>Today's learning</h1>

            <p>
              {formatTime(
                tracking.today_seconds
              )}{" "}
              spent learning today.
            </p>
          </div>

          {/* Course selector */}

          <div className="tracking-course-selector">

            <label>COURSE</label>

            <div className="custom-course-dropdown">

              <button
                type="button"
                className="course-dropdown-button"
                onClick={() =>
                  setCourseDropdownOpen(
                    !courseDropdownOpen
                  )
                }
              >
                <div className="course-button-content">

                  <span className="course-button-label">
                    {tracking.courses.find(
                      (course) =>
                        course.course_id ===
                        Number(selectedCourseId)
                    )?.course_title}
                  </span>

                  <span className="course-button-subtitle">
                    Current course
                  </span>

                </div>

                <ChevronDown
                  size={17}
                  className={
                    courseDropdownOpen
                      ? "course-chevron-open"
                      : ""
                  }
                />

              </button>

              {courseDropdownOpen && (
                <div className="course-dropdown-menu">

                  {tracking.courses.map(
                    (course) => (

                      <button
                        type="button"
                        key={course.course_id}
                        className={`course-dropdown-item ${
                          Number(selectedCourseId) ===
                          course.course_id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          handleCourseChange({
                            target: {
                              value: course.course_id,
                            },
                          });
                        }}
                      >

                        <div className="course-item-number">
                          {String(
                            course.course_id
                          ).padStart(2, "0")}
                        </div>

                        <div className="course-item-content">

                          <span>
                            {course.course_title}
                          </span>

                          <small>
                            {course.daily_goal_hours}h daily goal
                          </small>

                        </div>

                        {Number(selectedCourseId) ===
                          course.course_id && (
                          <div className="course-selected-dot"></div>
                        )}

                      </button>

                    )
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

        {/* Weekly chart */}

        <section className="progress-section">

          <div className="section-heading">

            <div>
              <span>PROGRESS</span>

              <h2>
                Your learning activity
              </h2>
            </div>

            <BarChart3 size={22} />

          </div>

          <div className="chart-area">

            <div className="chart-y-axis">

              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>

            </div>

            <div className="chart-content">

              <div className="chart-grid">

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

              </div>

              <div className="chart-bars">

                {weekDays.map((day) => {

                  /*
                    Calculate percentage based
                    on daily goal.
                  */

                  const percentage =
                    goalSeconds > 0
                      ? (day.seconds /
                          goalSeconds) *
                        100
                      : 0;

                  const height =
                    day.seconds > 0
                      ? Math.min(
                          percentage,
                          100
                        )
                      : 0;

                  return (
                    <div
                      className="chart-bar-wrapper"
                      key={day.date}
                    >

                      <div
                        className="chart-bar"
                        style={{
                          height:
                            `${height}%`,
                        }}
                        onMouseEnter={() =>
                          setHoveredDay(
                            day.date
                          )
                        }
                        onMouseLeave={() =>
                          setHoveredDay(null)
                        }
                      >

                        {hoveredDay ===
                          day.date &&
                          day.seconds > 0 && (
                            <div className="bar-value">
                              {formatTime(
                                day.seconds
                              )}
                            </div>
                          )}

                      </div>

                      <span>
                        {day.day}
                      </span>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

          {/* Goal explanation */}

          <div className="chart-goal">

            <Target size={15} />

            <span>
              Daily goal:{" "}
              {tracking.daily_goal_hours} hour
              {tracking.daily_goal_hours > 1
                ? "s"
                : ""}
            </span>

          </div>

        </section>

        {/* Stats */}

        <div className="tracking-stats">

          <div className="tracking-stat">

            <div className="stat-icon">
              <Target size={19} />
            </div>

            <div>

              <span>GOAL</span>

              <h3>
                {tracking.daily_goal_hours}h
              </h3>

              <p>
                Daily learning goal
              </p>

            </div>

          </div>

          <div className="tracking-stat">

            <div className="stat-icon">
              <Flame size={19} />
            </div>

            <div>

              <span>STREAK</span>

              <h3>—</h3>

              <p>
                Current streak
              </p>

            </div>

          </div>

          <div className="tracking-stat">

            <div className="stat-icon">
              <Clock3 size={19} />
            </div>

            <div>

              <span>TIME</span>

              <h3>
                {formatTime(
                  tracking.total_seconds
                )}
              </h3>

              <p>
                Total learning time
              </p>

            </div>

          </div>

          <div className="tracking-stat">

            <div className="stat-icon">
              <Activity size={19} />
            </div>

            <div>

              <span>ACTIVITY</span>

              <h3>
                {tracking.completed_topics}
              </h3>

              <p>
                Topics completed
              </p>

            </div>

          </div>

        </div>

        {/* Recent activity */}

        <section className="activity-section">

          <div className="section-heading">

            <div>

              <span>ACTIVITY</span>

              <h2>
                Recent learning activity
              </h2>

            </div>

            <Activity size={22} />

          </div>

          <div className="activity-empty">

            <Activity size={25} />

            <p>
              {tracking.today_seconds > 0
                ? `You've learned for ${formatTime(
                    tracking.today_seconds
                  )} today.`
                : "No learning activity yet."}
            </p>

            <span>
              Keep learning to build your
              progress.
            </span>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Tracking;