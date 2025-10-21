import React from "react";
import "./Home.css";
import logo from "./logo.png"; // Keep logo in the same folder

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="overlay"></div>

        <div className="hero-content">
          <img
            src={logo}
            alt="Madhya Pradesh Government Logo"
            className="hero-logo"
          />
          <h1 className="hero-title">
            मध्यप्रदेश श्रम मंत्रालय में आपका स्वागत है।
          </h1>
          <p className="hero-subtext">
            राज्य के श्रमिकों के अधिकार, सुरक्षा और कल्याण के लिए समर्पित।
          </p>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>हमारा उद्देश्य</h3>
          <p>
            श्रमिकों के हितों की रक्षा करना, सुरक्षित कार्य वातावरण प्रदान
            करना, और सामाजिक न्याय को बढ़ावा देना।
          </p>
        </div>

        <div className="info-card">
          <h3>मुख्य सेवाएँ</h3>
          <p>
            ऑनलाइन शिकायत निवारण, श्रमिक पंजीकरण, और सरकारी योजनाओं की
            जानकारी एक ही मंच पर।
          </p>
        </div>

        <div className="info-card">
          <h3>संपर्क करें</h3>
          <p>
            श्रम मंत्रालय, मध्यप्रदेश शासन, भोपाल <br /> ईमेल:
            labour@mp.gov.in | हेल्पलाइन: 1800-233-4567
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
