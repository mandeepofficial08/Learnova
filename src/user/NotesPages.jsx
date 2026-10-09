import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./NotesPages.css";

function NotesPages() {
  const { notesUrl } = useParams();
  const navigate = useNavigate();

  const decodedUrl = decodeURIComponent(notesUrl);

  return (
    <main className="notes-page">
      <div className="notes-container">

        <button
          className="notes-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          Back to Topic
        </button>

        <div className="notes-heading">
          <span>LEARNING RESOURCE</span>
          <h1>Course Notes</h1>
        </div>

        <div className="notes-frame-wrapper">
          <iframe
            src={decodedUrl}
            title="Course Notes"
          />
        </div>

      </div>
    </main>
  );
}

export default NotesPages;