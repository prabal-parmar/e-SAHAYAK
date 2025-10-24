import React, { useEffect, useState } from "react";
import "./Home.css";
import logo from "./logo.png";
import { getHourWage, updateHourWage } from "../api/workerRoutes/allWorkers";

function Home() {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [overtimeWage, setOvertimeWage] = useState(0);
  const [hourWage, setHourWage] = useState(0);
  const [extraWage, setExtraWage] = useState(0);

  const handleUpdate = async () => {
    setHourWage(hourlyWage);
    setExtraWage(overtimeWage);
    await updateHourWage(hourlyWage, overtimeWage);
  };

  useEffect(() => {
    const fetchHourWage = async () => {
      const data = await getHourWage();
      setHourWage(data.wages.hourWage);
      setExtraWage(data.wages.overtimeWage);
    }
    fetchHourWage()
  }, [])
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="overlay"></div>
        <div className="hero-content">
          <img src={logo} alt="Madhya Pradesh Government Logo" className="hero-logo" />
          <h1 className="hero-title">मध्यप्रदेश श्रम मंत्रालय में आपका स्वागत है।</h1>
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

      <div className="wage-section">
        <h2>वेतन विवरण</h2>

        <div className="current-wage-display">
          <div className="wage-display-card">
            <h4>वर्तमान घंटे का वेतन</h4>
            <p className="wage-value">₹ {hourWage.toFixed(2)} / घंटा</p>
          </div>
          <div className="wage-display-card">
            <h4>वर्तमान ओवरटाइम वेतन</h4>
            <p className="wage-value">₹ {extraWage.toFixed(2)} / घंटा</p>
          </div>
        </div>

        <div className="wage-cards">
          <div className="wage-card">
            <h4>घंटे का वेतन</h4>
            <input
              type="number"
              step="0.01"
              value={hourlyWage}
              onChange={(e) => setHourlyWage(parseFloat(e.target.value) || 0)}
              placeholder="घंटे का वेतन दर्ज करें"
            />
            <p>₹ {hourlyWage.toFixed(2)} प्रति घंटा</p>
          </div>

          <div className="wage-card">
            <h4>अतिरिक्त समय का वेतन</h4>
            <input
              type="number"
              step="0.01"
              value={overtimeWage}
              onChange={(e) => setOvertimeWage(parseFloat(e.target.value) || 0)}
              placeholder="ओवरटाइम वेतन दर्ज करें"
            />
            <p>₹ {overtimeWage.toFixed(2)} प्रति घंटा</p>
          </div>
        </div>

        <button className="update-button" onClick={handleUpdate}>
          वेतन अपडेट करें
        </button>
      </div>
    </div>
  );
}

export default Home;
