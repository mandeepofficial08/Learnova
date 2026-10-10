
import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  Clock3,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import "./Tracking.css";

const API_BASE = "http://localhost/Learnova_backend";

function formatTime(seconds = 0) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

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

function Tracking() {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const selectedCourse = tracking?.selected_course;
  const courseId = Number(selectedCourseId || selectedCourse?.id || 0);

  const totalSeconds = Number(tracking?.total_seconds || 0);
  const todaySeconds = Number(tracking?.today_seconds || 0);

  const fetchTracking = useCallback(async (id = null, showLoader = false) => {
    const currentUser = getUser();

    if (!currentUser?.id) {
      setTracking(null);
      setLoading(false);
      return;
    }

    if (showLoader) setLoading(true);

    try {
      const params = new URLSearchParams({
        user_id: String(currentUser.id),
      });

      if (id) params.set("course_id", String(id));

      const response = await fetch(
        `${API_BASE}/tracking.php?${params}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load learning activity."
        );
      }

      setTracking(data);

      const chosenId = Number(data.selected_course?.id);
      if (chosenId) setSelectedCourseId(chosenId);
    } catch (error) {
      console.error("Tracking request failed:", error);

      // Avoid repeated error toasts during automatic refreshes.
      if (showLoader) {
        toast.error(error.message || "Could not load tracking.");
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("course_id")) || null;

    fetchTracking(id, true);
  }, [fetchTracking]);

  // Refresh live learning time and daily activity while the page is visible.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") {
        fetchTracking(courseId || null);
      }
    };

    const intervalId = window.setInterval(refresh, 10000);

    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [fetchTracking, courseId]);

  const handleCourseChange = (id) => {
    const nextId = Number(id);

    setCourseDropdownOpen(false);
    setSelectedCourseId(nextId);
    fetchTracking(nextId, true);
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

  if (!tracking?.enrolled) {
    return (
      <div className="tracking-page">
        <div className="tracking-container">
          <h1>No active course</h1>
          <p>Enroll in a course to view your learning statistics.</p>
        </div>
      </div>
    );
  }

  // Build the last seven calendar days, including days with no activity.
  const weekDays = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const activity = tracking.weekly_activity?.find(
      (item) => item.date === dateKey
    );

    weekDays.push({
      date: dateKey,
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      seconds: Math.max(0, Number(activity?.seconds || 0)),
    });
  }

  // No goal or fixed maximum. The busiest displayed day sets the scale.
  const maximumDaySeconds = Math.max(
    1,
    ...weekDays.map((day) => day.seconds)
  );

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        <div className="tracking-header">
          <div>
            <span className="tracking-label">LEARNING</span>
            <h1>Learning time</h1>
            <p>{formatTime(todaySeconds)} spent learning today.</p>
          </div>

          <div className="tracking-course-selector">
            <label>COURSE</label>

            <div className="custom-course-dropdown">
              <button
                type="button"
                className="course-dropdown-button"
                onClick={() =>
                  setCourseDropdownOpen((open) => !open)
                }
                aria-expanded={courseDropdownOpen}
              >
                <div className="course-button-content">
                  <span className="course-button-label">
                    {tracking.courses?.find(
                      (course) =>
                        Number(course.course_id) === courseId
                    )?.course_title ||
                      selectedCourse?.title ||
                      "Select course"}
                  </span>

                  <span className="course-button-subtitle">
                    Learning statistics
                  </span>
                </div>

                <ChevronDown
                  size={17}
                  className={
                    courseDropdownOpen ? "course-chevron-open" : ""
                  }
                />
              </button>

              {courseDropdownOpen && (
                <div className="course-dropdown-menu">
                  {tracking.courses?.map((course) => (
                    <button
                      type="button"
                      key={course.course_id}
                      className={`course-dropdown-item ${
                        courseId === Number(course.course_id)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleCourseChange(course.course_id)
                      }
                    >
                      <div className="course-item-number">
                        {String(course.course_id).padStart(2, "0")}
                      </div>

                      <div className="course-item-content">
                        <span>{course.course_title}</span>
                        <small>View learning time</small>
                      </div>

                      {courseId === Number(course.course_id) && (
                        <div className="course-selected-dot" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="progress-section">
          <div className="section-heading">
            <div>
              <span>LEARNING ACTIVITY</span>
              <h2>Your learning this week</h2>
            </div>

            <BarChart3 size={22} />
          </div>

          <div className="chart-area">
            <div className="chart-y-axis tracking-time-axis">
              <span>{formatTime(maximumDaySeconds)}</span>
              <span>{formatTime(maximumDaySeconds * 0.75)}</span>
              <span>{formatTime(maximumDaySeconds * 0.5)}</span>
              <span>{formatTime(maximumDaySeconds * 0.25)}</span>
              <span>0s</span>
            </div>

            <div className="chart-content">
              <div className="chart-grid">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="chart-bars">
                {weekDays.map((day) => {
                  const height =
                    day.seconds > 0
                      ? Math.max(
                          2,
                          (day.seconds / maximumDaySeconds) * 100
                        )
                      : 0;

                  return (
                    <div
                      className="chart-bar-wrapper"
                      key={day.date}
                    >
                      <div
                        className="chart-bar"
                        style={{ height: `${height}%` }}
                        title={`${day.day}: ${formatTime(day.seconds)}`}
                        aria-label={`${day.day}: ${formatTime(day.seconds)} of learning`}
                      >
                        {day.seconds > 0 && (
                          <div className="bar-value">
                            {formatTime(day.seconds)}
                          </div>
                        )}
                      </div>

                      <span>{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="tracking-stats tracking-time-stats">
          <div className="tracking-stat">
            <div className="stat-icon">
              <Clock3 size={19} />
            </div>

            <div>
              <span>TODAY</span>
              <h5>{formatTime(todaySeconds)}</h5>
              <p>Time spent today</p>
            </div>
          </div>

          <div className="tracking-stat">
            <div className="stat-icon">
              <BarChart3 size={19} />
            </div>

            <div>
              <span>COURSE TOTAL</span>
              <h5>{formatTime(totalSeconds)}</h5>
              <p>Accumulated learning time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;
