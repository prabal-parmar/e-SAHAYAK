import React, { useEffect, useState } from "react";
import "./ComplaintBox.css";
import {
  fetchAllPendingReports,
  fetchAllResolvedReports,
  resolveReportWithMessage,
} from "../api/adminReportsRoutes"; // Updated import path
import adminApi from "../api/adminAxios"; // Import the adminApi instance

function ComplaintBox() {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [clickedEmployer, setClickedEmployer] = useState(null);
  const [clickedWorker, setClickedWorker] = useState(null);
  const getPendingReports = async () => {
    try {
      const pendingReports = await fetchAllPendingReports();
      setPendingComplaints(pendingReports);
    } catch (error) {
      console.error(error);
    }
  };

  const getResolvedReports = async () => {
    try {
      const resolvedReports = await fetchAllResolvedReports();
      setResolvedComplaints(resolvedReports);
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployerData = async (username) => {
    try {
      const response = await adminApi.get(`get-employer-data/${username}/`); // Use adminApi
      return response.data.employer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getWorkerData = async (username) => {
    try {
      const response = await adminApi.get(`get-worker-data/${username}/`); // Use adminApi
      return response.data.worker;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleEmployerProfile = async (username) => {
    try {
      const employer = await getEmployerData(username);
      setClickedEmployer(Array.isArray(employer) ? employer[0] : employer);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWorkerProfile = async (username) => {
    try {
      const worker = await getWorkerData(username);
      console.log(worker);
      setClickedWorker(Array.isArray(worker) ? worker[0] : worker);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPendingReports();
    getResolvedReports();
  }, []);

  const handleResolve = (complaint) => {
    setSelectedComplaint(complaint);
    setReplyMessage("");
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please write a response before submitting!");
      return;
    }

    const updatedPending = pendingComplaints.filter(
      (c) => c.id !== selectedComplaint.id
    );

    const resolvedItem = {
      ...selectedComplaint,
      adminResponse: replyMessage,
    };
    await resolveReportWithMessage(selectedComplaint.id, replyMessage);
    setPendingComplaints(updatedPending);
    setResolvedComplaints([resolvedItem, ...resolvedComplaints]);
    setSelectedComplaint(null);
    setReplyMessage("");
  };

  return (
    <div className="complaint-container">
      <h2 className="complaint-title">📨 Worker Complaints Dashboard</h2>

      <div className="tab-buttons">
        <button
          className={activeTab === "pending" ? "active-tab" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Complaints
        </button>
        <button
          className={activeTab === "resolved" ? "active-tab" : ""}
          onClick={() => setActiveTab("resolved")}
        >
          Resolved Complaints
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="complaint-grid">
          {pendingComplaints.length === 0 ? (
            <p className="no-complaints">No pending complaints 🎉</p>
          ) : (
            pendingComplaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <h3
                    onClick={() => handleWorkerProfile(complaint.workerName)}
                    className="clickable-employer"
                    style={{ textDecoration: "none" }}
                  >
                    {complaint.workerName}
                  </h3>
                  <span className="status-badge pending">Pending</span>
                </div>

                <div className="complaint-details">
                  <p>
                    <strong>Employer:</strong>{" "}
                    <span
                      className="clickable-employer"
                      onClick={() =>
                        handleEmployerProfile(complaint.employerName)
                      }
                    >
                      {complaint.employerName}
                    </span>
                  </p>
                  <p>
                    <strong>Contact:</strong> {complaint.contact}
                  </p>
                  <p>
                    <strong>Reason:</strong> {complaint.reason || "—"}
                  </p>
                </div>

                <p className="complaint-message">
                  <strong>Complaint:</strong> {complaint.message}
                </p>

                <button
                  className="resolve-btn"
                  onClick={() => handleResolve(complaint)}
                >
                  Mark as Resolved
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "resolved" && (
        <div className="complaint-grid">
          {resolvedComplaints.length === 0 ? (
            <p className="no-complaints">No resolved complaints yet.</p>
          ) : (
            resolvedComplaints.map((complaint) => (
              <div key={complaint.id} className="complaint-card resolved-card">
                <div className="complaint-header">
                  <h3
                    onClick={() => handleWorkerProfile(complaint.workerName)}
                    className="clickable-employer"
                    style={{ textDecoration: "none" }}
                  >
                    {complaint.workerName}
                  </h3>
                  <span className="status-badge solved">Resolved</span>
                </div>

                <div className="complaint-details">
                  <p>
                    <strong>Employer:</strong>{" "}
                    <span
                      className="clickable-employer"
                      onClick={() =>
                        handleEmployerProfile(complaint.employerName)
                      }
                    >
                      {complaint.employerName}
                    </span>
                  </p>
                  <p>
                    <strong>Contact:</strong> {complaint.contact}
                  </p>
                  <p>
                    <strong>Reason:</strong> {complaint.reason || "—"}
                  </p>
                </div>

                <p className="complaint-message">
                  <strong>Complaint:</strong> {complaint.message}
                </p>

                <div className="admin-reply">
                  <strong>Admin Response:</strong>
                  <p>{complaint.adminResponse}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedComplaint && (
        <div className="reply-modal-overlay">
          <div className="reply-modal">
            <h3>Reply to {selectedComplaint.workerName}</h3>
            <p>
              <strong>Employer:</strong> {selectedComplaint.employerName}
            </p>
            <p>
              <strong>Contact:</strong> {selectedComplaint.contact}
            </p>
            <p>
              <strong>Reason:</strong> {selectedComplaint.reason}
            </p>
            <p>
              <strong>Complaint:</strong> {selectedComplaint.message}
            </p>

            <textarea
              rows="4"
              placeholder="Write your response here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedComplaint(null)}
              >
                Cancel
              </button>
              <button className="send-btn" onClick={() => handleSendReply()}>
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}

      {clickedEmployer && (
        <div className="employer-modal-overlay">
          <div className="employer-modal">
            <button
              className="close-modal-btn"
              onClick={() => setClickedEmployer(null)}
            >
              ❌
            </button>
            <h3>🏢 Employer Details</h3>
            <div className="employer-info">
              {Object.entries(clickedEmployer).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : value}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {clickedWorker && (
        <div className="worker-modal-overlay">
          <div className="worker-modal">
            <button
              className="close-modal-btn"
              onClick={() => setClickedWorker(null)}
            >
              ❌
            </button>
            <h3>👷 Worker Details</h3>
            <div className="worker-info">
              {Object.entries(clickedWorker).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : value}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintBox;
