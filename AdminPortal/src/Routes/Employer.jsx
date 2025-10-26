import React, { useEffect, useState } from "react";
import "./Employer.css";
import {
  getAllEmployers,
  getEmployerData,
} from "../api/employerRoutes/allEmployers";
import { getAttendanceByEmployerAndDate } from "../api/employerRoutes/attendanceData";

function Employer() {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [reportStatistics, setReportStatistics] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const response = await getAllEmployers();
        console.log(response.employers)
        const employersData =
          response && response.employers ? response.employers.flat() : [];
        const sortedData = employersData.sort((a, b) => a.id - b.id);
        setEmployers(sortedData);
      } catch (error) {
        console.error("Error fetching employers:", error);
      }
    };
    fetchEmployerData();
  }, []);

  const filteredEmployers = employers.filter(
    (emp) =>
      (emp.employer?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (emp.org_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedEmployer) {
      const fetchDetails = async () => {
        try {
          const employerData = await getEmployerData(selectedEmployer.employer);
          console.log(employerData)
          setReportStatistics(employerData.reports)
        } catch (err) {
          console.error("Error fetching employer details:", err);
        }
      };
      fetchDetails();
    }
  }, [selectedEmployer]);

  useEffect(() => {
    if (selectedEmployer && selectedDate) {
      const fetchAttendance = async () => {
        setLoadingAttendance(true);
        try {
          const dateObj = new Date(selectedDate);
          const day = dateObj.getDate();
          const month = dateObj.getMonth() + 1;
          const year = dateObj.getFullYear();
          const formattedDate = `${year}-${month}-${day}`;
          const response = await getAttendanceByEmployerAndDate(
            selectedEmployer.id,
            formattedDate
          );
          setAttendanceData(response.workers || []);
        } catch (err) {
          console.error("Error fetching attendance:", err);
          setAttendanceData([]);
        } finally {
          setLoadingAttendance(false);
        }
      };
      fetchAttendance();
    }
  }, [selectedDate, selectedEmployer]);

  return (
    <div className="employer-page">
      <div className="employer-container">
        {!selectedEmployer ? (
          <>
            <h2 className="employer-title">Employer Management</h2>
            <p className="employer-subtitle">
              View, Search, and Manage Employer Profiles
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search by employer or org_name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="employer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employer</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Organization</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployers.length > 0 ? (
                  filteredEmployers.map((emp) => (
                    <tr
                      key={
                        emp.id || emp.emailId || emp.org_name || Math.random()
                      }
                    >
                      <td>{emp.id}</td>
                      <td
                        className="clickable"
                        onClick={() => setSelectedEmployer(emp)}
                      >
                        {emp.employer}
                      </td>
                      <td>{emp.emailId}</td>
                      <td>{emp.contact_number}</td>
                      <td>{emp.org_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-employer">
                    <td colSpan="5" className="no-data">
                      No employers found 😕
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <button
              className="back-btn"
              onClick={() => setSelectedEmployer(null)}
            >
              ← Back
            </button>

            <div className="profile-section">
              <h2>{selectedEmployer.employer}</h2>
              <div className="employer-details-grid">
                <p>
                  <strong>Email:</strong> {selectedEmployer?.emailId || "N/A"}
                </p>
                <p>
                  <strong>Contact Number:</strong>{" "}
                  {selectedEmployer?.contact_number || "N/A"}
                </p>
                <p>
                  <strong>Organization:</strong>{" "}
                  {selectedEmployer?.org_name || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedEmployer?.address || "N/A"}
                </p>

                <div className="reports-summary">
                  <p>
                    <strong>Total Reports:</strong> {reportStatistics.total}
                  </p>
                  <p className="pending-reports">
                    <strong>Pending:</strong> {reportStatistics.pending}
                  </p>
                  <p className="resolved-reports">
                    <strong>Resolved:</strong> {reportStatistics.resolved}
                  </p>
                </div>
              </div>
            </div>

            <div className="date-selector">
              <h3>Select a Date to View Attendance</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="calendar-input"
              />
            </div>

            <div className="attendance-section">
              {selectedDate && (
                <h3>
                  Workers Attended on{" "}
                  {new Date(selectedDate).toLocaleDateString("en-GB")}
                </h3>
              )}

              {loadingAttendance ? (
                <p>Loading attendance data...</p>
              ) : attendanceData.length > 0 ? (
                <div className="attendance-table">
                  <div className="attendance-header">
                    <div>Worker Username</div>
                    <div>Date</div>
                    <div>Amount</div>
                  </div>

                  {attendanceData.map((record, index) => (
                    <div
                      className="attendance-row"
                      key={`${record.workerUsername || "unknown"}-${
                        record.date || index
                      }`}
                    >
                      <div>{record.workerUsername}</div>
                      <div>
                        {record.date
                          ? new Date(record.date).toLocaleDateString("en-GB")
                          : "N/A"}
                      </div>
                      <div
                        className={
                          record.amount_given ? "amount-paid" : "amount-pending"
                        }
                      >
                        {record.amount_given
                          ? `₹${record.amount}`
                          : "Not Given"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                selectedDate && (
                  <p className="no-data">No attendance for this date.</p>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Employer;
