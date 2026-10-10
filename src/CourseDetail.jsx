
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Code2,
  Lightbulb,
  ArrowLeft,
  LockKeyhole,
} from "lucide-react";
import "./CourseDetail.css";

function CourseDetail() {
  const location = useLocation();

  const course = location.state?.course || {
    title: "Web Development",
    category: "Web Development",
    description:
      "Learn how websites are created, designed, and made interactive using essential web technologies.",
    topics: [
      "Introduction to Web Development",
      "HTML and Website Structure",
      "CSS and Webpage Styling",
      "JavaScript Fundamentals",
      "Responsive Website Basics",
    ],
    uses: [
      "Understand how websites work",
      "Create basic web pages",
      "Build a foundation for future projects",
    ],
  };

  return (
    <div className="guest-course-page">
      <Link to="/explore" className="guest-back-link">
        <ArrowLeft size={18} />
        Back to Explore
      </Link>

      <section className="guest-course-hero">
        <span className="guest-course-category">
          {course.category || "Course"}
        </span>

        <h1>{course.title || "Course Details"}</h1>

        <p>
          {course.description ||
            "Explore the fundamentals of this subject and build your knowledge step by step."}
        </p>
      </section>

      <section className="guest-course-section">
        <div className="guest-section-heading">
          <BookOpen size={22} />
          <h2>What You'll Learn</h2>
        </div>

        <p className="guest-section-description">
          Get familiar with the basic concepts covered in this course.
        </p>

        <div className="guest-topic-list">
          {(course.topics || [
            "Introduction to the subject",
            "Basic concepts and terminology",
            "Core principles",
            "Practical applications",
          ]).map((topic, index) => (
            <div className="guest-topic-item" key={index}>
              <span className="guest-topic-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </section>

      {/*  */}

      <section className="guest-course-cta">
        <div className="guest-lock-icon">
          <LockKeyhole size={24} />
        </div>

        <h2>Ready to Start Learning?</h2>

        <p>
          Create a free Learnova account to access your learning
          space and continue exploring available resources.
        </p>

        <div className="guest-course-actions">
          <Link to="/login" className="guest-login-button">
            Log In
          </Link>

          <Link to="/register" className="guest-register-button">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;
