import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./VideoPage.css";

function VideoPage() {
  const { videoUrl } = useParams();
  const navigate = useNavigate();

  const decodedUrl = decodeURIComponent(videoUrl);

  let videoId = "";

  try {
    const url = new URL(decodedUrl);

    if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v") || "";
    } else if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.substring(1);
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="video-page">
      <div className="video-container">

        <button
          className="video-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} />
          Back to Topic
        </button>

        <div className="video-heading">
          <span>LEARNING RESOURCE</span>
          <h1>Course Video</h1>
        </div>

        {videoId ? (
          <div className="video-frame-wrapper">
            <iframe
  src="https://www.youtube.com/embed/kUMe1FH4CHE"
  title="Course Video"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
/>
          </div>
        ) : (
          <p>Unable to load this video.</p>
        )}

      </div>
    </main>
  );
}

export default VideoPage;