import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
} from "lucide-react";
import "./Courses.css";

const API = "http://localhost/Learnova_backend";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState({});

  useEffect(() => {
    async function loadCourses() {
      try {
        const storedUser =
          localStorage.getItem("learnovaUser") ||
          sessionStorage.getItem("learnovaUser");

        const user = storedUser ? JSON.parse(storedUser) : null;

        if (user?.id) {
          setUserId(user.id);
        }

        const response = await fetch(`${API}/courses.php`);
        const data = await response.json();

        if (!data.success) return;

        setCourses(data.courses);

        if (!user?.id) return;

        const enrollmentResults = await Promise.all(
          data.courses.map(async (course) => {
            try {
              const res = await fetch(
                `${API}/check_enrollment.php?user_id=${user.id}&course_id=${course.id}`
              );

              const result = await res.json();

              return {
                courseId: course.id,
                enrollment:
                  result.success && result.enrolled
                    ? result.enrollment
                    : null,
              };
            } catch {
              return {
                courseId: course.id,
                enrollment: null,
              };
            }
          })
        );

        const enrollments = {};

        enrollmentResults.forEach(({ courseId, enrollment }) => {
          if (enrollment) {
            enrollments[courseId] = enrollment;
          }
        });

        setEnrollmentData(enrollments);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <main className="courses-page">
        <div className="courses-container courses-loading">
          Preparing your courses...
        </div>
      </main>
    );
  }

  const enrolledCourses = courses.filter(
    (course) => enrollmentData[course.id]
  );

  const activeCourses = enrolledCourses.filter(
    (course) => enrollmentData[course.id]?.status !== "completed"
  );

  const completedCourses = enrolledCourses.filter(
    (course) => enrollmentData[course.id]?.status === "completed"
  );

  const otherCourses = courses.filter(
    (course) => !enrollmentData[course.id]
  );

  return (
    <main className="courses-page">
      <div className="courses-container">
        <section className="courses-hero">
          <div className="courses-hero-copy">
            <h1>
              Your
              <br />
              <em>courses</em>
            </h1>
          </div>
        </section>

        {/* ACTIVE COURSES */}

        {activeCourses.length > 0 && (
          <section className="course-section">
            <div className="course-section-heading">
              <div>
                <h2>Continue learning</h2>
              </div>

              <span className="course-section-count">
                {activeCourses.length} active
              </span>
            </div>

            <div className="enrolled-course-list">
              {activeCourses.map((course, index) => (
                <article
                  className="enrolled-course-card"
                  key={course.id}
                  style={{ "--item-index": index }}
                >
                  <div className="enrolled-course-main">
                    <span className="course-number">
                      {String(course.id).padStart(2, "0")}
                    </span>

                    <div className="enrolled-course-info">
                      <span className="course-status">
                        <span className="status-dot" />
                        CURRENTLY ENROLLED
                      </span>

                      <h3>{course.title}</h3>

                      <p>
                        {course.description ||
                          "Continue exploring this course at your own pace."}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/user/courses/${course.id}`}
                    className="continue-course-button"
                  >
                    <Play size={14} fill="currentColor" />
                    Continue learning
                    <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* COMPLETED COURSES */}

        {completedCourses.length > 0 && (
          <section className="course-section completed-courses-section">
            <div className="course-section-heading">
              <div>
                <span className="courses-section-label">
                  FINISHED COURSES
                </span>

                <h2>Completed courses</h2>
              </div>

              <span className="course-section-count">
                {completedCourses.length} completed
              </span>
            </div>

            <div className="enrolled-course-list">
              {completedCourses.map((course, index) => (
                <article
                  className="enrolled-course-card completed-course-card"
                  key={course.id}
                  style={{ "--item-index": index }}
                >
                  <div className="enrolled-course-main">
                    <span className="course-number">
                      {String(course.id).padStart(2, "0")}
                    </span>

                    <div className="enrolled-course-info">
                      <span className="course-status completed-status">
                        <CheckCircle2 size={15} />
                        COURSE COMPLETED
                      </span>

                      <h3>{course.title}</h3>

                      <p>
                        {course.description ||
                          "You have completed this course. Revisit it whenever you want."}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/user/courses/${course.id}`}
                    className="continue-course-button completed-course-button"
                  >
                    <BookOpen size={15} />
                    Review course
                    <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* EXPLORE OTHER COURSES */}

        <section className="course-section explore-courses-section">
          <div className="course-section-heading">
            <div>
              <span className="courses-section-label">
                EXPLORE YOUR OPTIONS
              </span>

              <h2>
                {enrolledCourses.length
                  ? "Discover more"
                  : "Explore courses"}
              </h2>
            </div>

            <span className="course-section-count">
              {otherCourses.length} available
            </span>
          </div>

          {otherCourses.length > 0 ? (
            <div className="available-course-grid">
              {otherCourses.map((course, index) => (
                <article
                  className="available-course-card"
                  key={course.id}
                  style={{ "--item-index": index }}
                >
                  <div className="available-course-top">
                    <BookOpen size={22} />

                    <span className="available-course-number">
                      COURSE {String(course.id).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>{course.title}</h3>

                  <p>
                    {course.description ||
                      "Explore the fundamentals and develop practical skills."}
                  </p>

                  <div className="available-course-footer">
                    <span>
                      <Clock3 size={14} />
                      Learn at your own pace
                    </span>

                    <Link
                      to={`/user/courses/${course.id}`}
                      aria-label={`View ${course.title}`}
                    >
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <p className="courses-empty-message">
              You’re enrolled in every available course.
            </p>
          ) : (
            <p className="courses-empty-message">
              No courses are available right now.
            </p>
          )}
        </section>

        {!userId && (
          <p className="courses-login-note">
            Log in to see your course enrollments.
          </p>
        )}
      </div>
    </main>
  );
}

export default Courses;
