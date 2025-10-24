import React, { useEffect, useState } from "react";
import "./Workers.css";
import {
  getAllWorkers,
  getWorkerWorkHistory,
} from "../api/workerRoutes/allWorkers";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [workHistory, setWorkHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await getAllWorkers();
        const workersData = Array.isArray(response.workers)
          ? response.workers
          : [];
        const flatWorkers = workersData.flat();
        const sortedData = flatWorkers.sort((a, b) => a.id - b.id);
        setWorkers(sortedData);
        setFilteredWorkers(sortedData);
        // console.log(flatWorkers);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = workers.filter(
      (worker) =>
        worker.workerName?.toLowerCase().includes(lowerTerm) ||
        worker.workerUsername?.toLowerCase().includes(lowerTerm)
    );
    setFilteredWorkers(filtered);
  }, [searchTerm, workers]);

  useEffect(() => {
    if (selectedWorker && selectedDate) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const formattedDate = new Date(selectedDate)
            .toISOString()
            .split("T")[0];
          const response = await getWorkerWorkHistory(
            selectedWorker.id,
            formattedDate
          );
          setWorkHistory(response.worker || []);
        } catch (error) {
          console.error("Error fetching work history:", error);
          setWorkHistory([]);
        }
        setLoadingHistory(false);
      };
      fetchHistory();
    }
  }, [selectedWorker, selectedDate]);

  return (
    <div className="workers-page">
      <div className="workers-container">
        {!selectedWorker ? (
          <>
            <div className="header-section">
              <h2>All Workers</h2>
              <p>View, search, and manage all registered workers</p>
            </div>

            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="table-container">
              <table className="workers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Skill</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.length > 0 ? (
                    filteredWorkers.map((worker) => (
                      <tr key={worker.id}>
                        <td>{worker.id}</td>
                        <td>{worker.workerName}</td>
                        <td>{worker.workerUsername}</td>
                        <td>{worker.skill}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => setSelectedWorker(worker)}
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No workers found 😕
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>

            <button
              className="back-btn"
              onClick={() => setSelectedWorker(null)}
            >
              ← Back
            </button>

            <div className="worker-profile">
              <h2>{selectedWorker.workerName}</h2>
              <div className="worker-info">
                <p>
                  <strong>Username:</strong> {selectedWorker.workerUsername}
                </p>
                <p>
                  <strong>Skill:</strong> {selectedWorker.skill}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedWorker.gender}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedWorker.contact_number}
                </p>
                <p>
                  <strong>Address:</strong> {selectedWorker.address}
                </p>
              </div>

              <div className="report-section">
                <h4>Reported:</h4>
                <p>
                  {selectedWorker.report_count > 0
                    ? `${selectedWorker.report_count} times`
                    : "No reports"}
                </p>
              </div>

              <div className="date-selector">
                <h4>Select Date to View Work History</h4>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="calendar-input"
                />
              </div>

              {selectedDate && (
                <div className="work-history-section">
                  <h3>
                    Work History on{" "}
                    {new Date(selectedDate).toLocaleDateString("en-GB")}
                  </h3>

                  {loadingHistory ? (
                    <p className="loading">Loading work history...</p>
                  ) : workHistory.length > 0 ? (
                    <table className="work-history-table">
                      <thead>
                        <tr>
                          <th>Organization</th>
                          <th>Entry Time</th>
                          <th>Leaving Time</th>
                          <th>Overtime Entry Time</th>
                          <th>Overtime Leaving Time</th>
                          <th>Total Wage (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workHistory.map((entry, idx) => (
                          <tr key={idx}>
                            <td>{entry.orgName}</td>
                            <td>{entry.entryTime}</td>
                            <td>{entry.leavingTime}</td>
                            <td>{entry.overtimeEntryTime || "—"}</td>
                            <td>{entry.overtimeLeavingTime || "—"}</td>
                            <td>{entry.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-data">
                      No work history found for this date.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Workers;
