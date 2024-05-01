import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img
              src={image}
              alt="hero"
            />
          </div>
          <div className="hero-content">
            <p>
            We understand that managing your health can be a complex journey. That's why we've designed our platform to empower you with convenient access to a diverse range of healthcare specialists. Whether you're seeking routine check-ups, specialized treatments, or preventive care, we're here to support you every step of the way.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
