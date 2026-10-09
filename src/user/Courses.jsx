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
const [progressData, setProgressData] = useState({});
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

    enrollmentResults.forEach(
      ({ courseId, enrollment }) => {
        if (enrollment) {
          enrollments[courseId] = enrollment;
        }
      }
    );

    setEnrollmentData(enrollments);

    const enrolled = enrollmentResults.filter(
      (item) => item.enrollment
    );

    const progressResults = await Promise.all(
      enrolled.map(async ({ courseId, enrollment }) => {
        try {
          const res = await fetch(
            `${API}/progress.php?user_id=${user.id}&course_id=${courseId}`
          );

          const result = await res.json();

          const topics = result.success
            ? result.topics || []
            : [];

          const completed = topics.filter(
            (topic) => topic.status === "completed"
          ).length;

          const total = topics.length;

          const isCourseCompleted =
            enrollment?.status === "completed";

          return {
            courseId,
            completed: isCourseCompleted
              ? total
              : completed,
            total,
            percentage: isCourseCompleted
              ? 100
              : total
                ? Math.round(
                    (completed / total) * 100
                  )
                : 0,
          };
        } catch {
          return {
            courseId,
            completed: 0,
            total: 0,
            percentage: 0,
          };
        }
      })
    );

    const progress = {};

    progressResults.forEach((item) => {
      progress[item.courseId] = item;
    });

    setProgressData(progress);
  } catch (error) {
    console.error("Error loading courses:", error);
  } finally {
    setLoading(false);
  }
}

loadCourses();

}, []);

if (loading) {
return ( <main className="courses-page"> <div className="courses-container courses-loading">
Preparing your courses... </div> </main>
);
}

const enrolledCourses = courses.filter(
(course) => enrollmentData[course.id]
);

const activeCourses = enrolledCourses.filter(
(course) =>
enrollmentData[course.id]?.status !== "completed"
);

const completedCourses = enrolledCourses.filter(
(course) =>
enrollmentData[course.id]?.status === "completed"
);

const otherCourses = courses.filter(
(course) => !enrollmentData[course.id]
);

return ( <main className="courses-page"> <div className="courses-container">


    <div className="courses-topline">
      <span className="courses-breadcrumb">
        Learnova <span>/</span> My Courses
      </span>

      <span className="courses-count">
        <BookOpen size={15} />
        {courses.length} courses available
      </span>
    </div>

    <section className="courses-hero">
      <div className="courses-hero-copy">
        <span className="courses-eyebrow">
          YOUR LEARNING SPACE
        </span>

        <h1>
          Learn at your
          <br />
          <em>own pace.</em>
        </h1>
      </div>

      <div className="courses-hero-note">
        <BookOpen size={24} />
        <span>Your next chapter</span>
        <strong>Starts here.</strong>
      </div>
    </section>

    {/* ACTIVE COURSES */}

    {activeCourses.length > 0 && (
      <section className="course-section">
        <div className="course-section-heading">
          <div>
            <span className="courses-section-label">
              PICK UP WHERE YOU LEFT OFF
            </span>

            <h2>Continue learning</h2>
          </div>

          <span className="course-section-count">
            {activeCourses.length} active
          </span>
        </div>

        <div className="enrolled-course-list">
          {activeCourses.map((course, index) => {
            const progress = progressData[course.id] || {
              completed: 0,
              total: 0,
              percentage: 0,
            };

            return (
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
                        "Continue exploring topics in this course."}
                    </p>

                    <div className="course-progress-meta">
                      <span>Course progress</span>

                      <strong>
                        {progress.percentage}%
                      </strong>
                    </div>

                    <div
                      className="course-progress-track"
                      role="progressbar"
                      aria-label={`${course.title} progress`}
                      aria-valuenow={progress.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="course-progress-fill"
                        style={{
                          width: `${progress.percentage}%`,
                        }}
                      />
                    </div>

                    <span className="course-topic-count">
                      {progress.completed} of{" "}
                      {progress.total} topics completed
                    </span>
                  </div>
                </div>

                <Link
                  to={`/user/courses/${course.id}`}
                  className="continue-course-button"
                >
                  <Play
                    size={14}
                    fill="currentColor"
                  />

                  Continue learning

                  <ArrowUpRight size={16} />
                </Link>
              </article>
            );
          })}
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

            <p className="course-section-description">
              Courses you have already completed. You can
              still open them anytime to review the content.
            </p>
          </div>

          <span className="course-section-count">
            {completedCourses.length} completed
          </span>
        </div>

        <div className="enrolled-course-list">
          {completedCourses.map((course, index) => {
            const progress = progressData[course.id] || {
              completed: 0,
              total: 0,
              percentage: 100,
            };

            return (
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
                        "You have completed this course. Review the topics whenever you want."}
                    </p>

                    <div className="course-progress-meta">
                      <span>Course progress</span>

                      <strong>100%</strong>
                    </div>

                    <div
                      className="course-progress-track"
                      role="progressbar"
                      aria-label={`${course.title} progress`}
                      aria-valuenow={100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="course-progress-fill completed-progress-fill"
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>

                    <span className="course-topic-count">
                      {progress.total > 0
                        ? `${progress.total} of ${progress.total} topics completed`
                        : "Course completed"}
                    </span>
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
            );
          })}
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

          <p className="course-section-description">
            Choose a subject and start building your knowledge.
          </p>
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
                  COURSE{" "}
                  {String(course.id).padStart(2, "0")}
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
                  Set your daily goal
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
        Log in to see your enrollment and learning progress.
      </p>
    )}
  </div>
</main>


);
}

export default Courses;
