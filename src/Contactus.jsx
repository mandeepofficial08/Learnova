
import { useEffect, useState } from "react";
import "./Contactus.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbySUbQsC-omjahqK7uXIiZfNID2KYzKrb-N-tGVdHFulep_jHfCyPpxyfCk7hauvHIl/exec";

function Contactus() {
  const [showContact, setShowContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const section = document.getElementById("contact");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowContact(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setStatus({ type: "", message: "" });
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    toast.success("Your message has been sent!");
  } catch (error) {
    toast.error("Failed to send your message. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div id="contact" className="contact-page">
      <section className="contact-header">
        <p className={`contact-label ${showContact ? "show" : ""}`}>
          GET IN TOUCH
        </p>

        <h1 className={showContact ? "show" : ""}>
          We'd love to
          <span> hear from you.</span>
        </h1>

        <p className={showContact ? "show" : ""}>
          Have a question, suggestion, or need some help?
          Send us a message and we'll get back to you.
        </p>
      </section>

      <section className="contact-container">
        <div className="contact-info">
          <div className={`contact-info-block ${showContact ? "show" : ""}`}>
            <span>01</span>
            <h3>Email</h3>
            <p>support@learnova.com</p>
          </div>

          <div className={`contact-info-block ${showContact ? "show" : ""}`}>
            <span>02</span>
            <h3>Need help?</h3>
            <p>
              Tell us what you're having trouble with
              and we'll do our best to help.
            </p>
          </div>

          <div className={`contact-info-block ${showContact ? "show" : ""}`}>
            <span>03</span>
            <h3>Suggestions</h3>
            <p>
              Have an idea that could make Learnova
              better? We'd love to hear it.
            </p>
          </div>
        </div>

        <form
          className={`contact-form ${showContact ? "show" : ""}`}
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                maxLength={255}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="6"
              maxLength={5000}
              required
            />
          </div>

          {status.message && (
            <p
              role="status"
              className={`contact-status ${status.type}`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            className="contact-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            {!isSubmitting && <span>→</span>}
          </button>
        </form>
      </section>
     <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
  toastClassName="learnova-toast"
  progressClassName="learnova-toast-progress"
/>
    </div>
  );
}

export default Contactus;
