import { useParams, Link } from "react-router-dom";

function ResourcePage() {
  const { resourceUrl } = useParams();

  const decodedUrl = decodeURIComponent(resourceUrl);

  return (
    <main>
      <Link to="/user/courses">
        ← Back to Courses
      </Link>

      <h1>Learning Resource</h1>

      <iframe
        src={decodedUrl}
        width="100%"
        height="700"
        title="Learning Resource"
        style={{
          border: "none",
          marginTop: "20px",
        }}
      />
    </main>
  );
}

export default ResourcePage;