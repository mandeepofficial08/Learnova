import { useEffect, useState } from "react";
import "./Contactus.css";

function Contactus() {
  const [showContact, setShowContact] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const section = document.getElementById("contact");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowContact(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Thanks! Your message has been sent.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div id="contact" className="contact-page">

      {/* Header */}
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


      {/* Contact Area */}
      <section className="contact-container">

        {/* Left Side */}
        <div className="contact-info">

          <div className={`contact-info-block ${showContact ? "show" : ""}`}>
            <span>01</span>

            <h3>Email</h3>

            <p>
              support@learnova.com
            </p>
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


        {/* Form */}
        <form
          className={`contact-form ${showContact ? "show" : ""}`}
          onSubmit={handleSubmit}
        >

          <div className="form-row">

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>


            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
              />
            </div>

          </div>


          <div className="form-group">
            <label>Subject</label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              required
            />
          </div>


          <div className="form-group">
            <label>Message</label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="6"
              required
            ></textarea>
          </div>


          <button
            type="submit"
            className="contact-submit"
          >
            Send Message
            <span>→</span>
          </button>

        </form>

      </section>

    </div>
  );
}

export default Contactus;