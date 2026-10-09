
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Play,
} from "lucide-react";
import "./TopicPage.css";

const API = "http://localhost/Learnova_backend";

function TopicPage() {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [resources, setResources] = useState([]);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("learnovaUser") ||
      sessionStorage.getItem("learnovaUser");

    if (!storedUser) {
      return;
    }

    const user = JSON.parse(storedUser);

    fetch(
      `${API}/check_enrollment.php?user_id=${user.id}&course_id=${courseId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.enrolled) {
          setEnrollmentId(data.enrollment.id);
        }
      })
      .catch((error) => {
        console.error("Error checking enrollment:", error);
      });
  }, [courseId]);

  useEffect(() => {
    fetch(`${API}/roadmap.php?course_id=${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const foundTopic = data.topics.find(
            (item) => String(item.id) === String(topicId)
          );

          setTopic(foundTopic);

          if (foundTopic?.status === "completed") {
            setCompleted(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching topic:", error);
      });
  }, [courseId, topicId]);

  useEffect(() => {
    fetch(
      `${API}/resources.php?course_id=${courseId}&topic_id=${topicId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setResources(data.resources);
        }
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [courseId, topicId]);

  const handleCompleteTopic = () => {
    if (!enrollmentId || completing || completed) {
      return;
    }

    setCompleting(true);

    fetch(`${API}/complete_topic.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enrollment_id: enrollmentId,
        topic_id: topicId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCompleted(true);
        } else {
          alert(data.message || "Unable to complete topic.");
        }
      })
      .catch((error) => {
        console.error("Error completing topic:", error);
        alert("Unable to complete topic.");
      })
      .finally(() => {
        setCompleting(false);
      });
  };

  if (loading) {
    return (
      <main className="topic-page">
        <div className="topic-container topic-loading">
          Loading topic...
        </div>
      </main>
    );
  }

  if (!topic) {
    return (
      <main className="topic-page">
        <div className="topic-container">
          <button
            className="topic-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <h1>Topic not found</h1>
        </div>
      </main>
    );
  }

  const videoResources = resources.filter(
    (resource) =>
      resource.type === "video" ||
      resource.type === "playlist"
  );

  const noteResources = resources.filter(
    (resource) => resource.type === "pdf"
  );

  const otherResources = resources.filter(
    (resource) => resource.type === "link"
  );

  return (
    <main className="topic-page">
      <div className="topic-container">
        <button
          className="topic-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          Back to Course
        </button>

        <section className="topic-hero">
          <div className="topic-hero-copy">
            <span className="topic-eyebrow">
              YOUR LEARNING PATH
            </span>

            <span className="topic-step">
              STEP {String(topic.topic_order).padStart(2, "0")}
            </span>

            <h1>{topic.title}</h1>

            <p>
              {topic.description ||
                "Explore the resources below and continue building your knowledge."}
            </p>
          </div>

          <div className="topic-hero-icon">
            <BookOpen size={28} />
            <span>Study this topic</span>
          </div>
        </section>

        <section className="topic-resources">
          <div className="topic-section-heading">
            <div>
              <span className="topic-section-label">
                LEARNING MATERIAL
              </span>

              <h2>Resources</h2>
            </div>

            <span className="topic-resource-count">
              {resources.length}{" "}
              {resources.length === 1
                ? "resource"
                : "resources"}
            </span>
          </div>

          {videoResources.length > 0 && (
            <div className="resource-group">
              <div className="resource-group-heading">
                <div className="resource-group-icon">
                  <Play size={15} fill="currentColor" />
                </div>

                <div>
                  <h3>Videos</h3>
                  <p>Watch and learn at your own pace.</p>
                </div>
              </div>

              <div className="resource-list">
                {videoResources.map((resource, index) => (
                  <article
                    className="resource-card"
                    key={resource.id}
                  >
                    <div className="resource-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="resource-card-icon">
                      <Play size={19} fill="currentColor" />
                    </div>

                    <div className="resource-card-content">
                      <span className="resource-type">
                        {resource.type === "playlist"
                          ? "PLAYLIST"
                          : "VIDEO"}
                      </span>

                      <h4>{resource.title}</h4>
                    </div>

                    <button
                      className="resource-open-button"
                      onClick={() =>
                        navigate(
                          `/user/video/${encodeURIComponent(
                            resource.url
                          )}`
                        )
                      }
                      aria-label={`Watch ${resource.title}`}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {noteResources.length > 0 && (
            <div className="resource-group">
              <div className="resource-group-heading">
                <div className="resource-group-icon">
                  <FileText size={15} />
                </div>

                <div>
                  <h3>Notes</h3>
                  <p>Read the topic material in detail.</p>
                </div>
              </div>

              <div className="resource-list">
                {noteResources.map((resource, index) => (
                  <article
                    className="resource-card"
                    key={resource.id}
                  >
                    <div className="resource-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="resource-card-icon notes-icon">
                      <FileText size={19} />
                    </div>

                    <div className="resource-card-content">
                      <span className="resource-type">
                        PDF NOTES
                      </span>

                      <h4>{resource.title}</h4>
                    </div>

                    <button
                      className="resource-open-button"
                      onClick={() =>
                        navigate(
                          `/user/notes/${encodeURIComponent(
                            resource.url
                          )}`
                        )
                      }
                      aria-label={`Open ${resource.title}`}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {otherResources.length > 0 && (
            <div className="resource-group">
              <div className="resource-group-heading">
                <div className="resource-group-icon">
                  <LinkIcon size={15} />
                </div>

                <div>
                  <h3>More to explore</h3>
                  <p>Additional resources to go deeper.</p>
                </div>
              </div>

              <div className="resource-list">
                {otherResources.map((resource, index) => (
                  <article
                    className="resource-card"
                    key={resource.id}
                  >
                    <div className="resource-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="resource-card-icon">
                      <LinkIcon size={19} />
                    </div>

                    <div className="resource-card-content">
                      <span className="resource-type">
                        RESOURCE
                      </span>

                      <h4>{resource.title}</h4>
                    </div>

                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="resource-open-button"
                      aria-label={`Open ${resource.title}`}
                    >
                      <ArrowUpRight size={18} />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          )}

          {resources.length === 0 && (
            <div className="resources-empty">
              <BookOpen size={24} />
              <h3>No resources yet</h3>
              <p>
                Resources for this topic will be available
                soon.
              </p>
            </div>
          )}

          {enrollmentId && resources.length > 0 && (
  <div className="topic-completion">
              {completed ? (
                <div className="topic-completed-message">
                  <CheckCircle2 size={19} />
                  <span>Topic completed</span>
                </div>
              ) : (
                <button
                  className="topic-complete-button"
                  onClick={handleCompleteTopic}
                  disabled={completing}
                >
                  <Check size={17} />
                  {completing
                    ? "Marking as completed..."
                    : "Mark topic as completed"}
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default TopicPage;
