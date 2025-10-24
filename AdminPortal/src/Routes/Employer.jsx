import React, { useEffect, useState } from "react";
import "./Employer.css";
import { getAllEmployers } from "../api/employerRoutes/allEmployers";
import { getAttendanceByEmployerAndDate } from "../api/employerRoutes/attendanceData";

function Employer() {
  const [employers, setEmployers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const fetchEmployerData = async () => {
      const response = await getAllEmployers();
      const employersData = Array.isArray(response.employers[0])
        ? response.employers[0]
        : response.employers;
      const sortedData = employersData.sort((a, b) => a.id - b.id);
      setEmployers(sortedData);
    };
    fetchEmployerData();
  }, []);

  const filteredEmployers = employers.filter(
    (emp) =>
      emp.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.org_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        }
        setLoadingAttendance(false);
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
                    <tr key={emp.id}>
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
                  <tr>
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
              <p>
                <strong>Email:</strong> {selectedEmployer.emailId}
              </p>
              <p>
                <strong>Contact Number:</strong>{" "}
                {selectedEmployer.contact_number}
              </p>
              <p>
                <strong>Organization:</strong> {selectedEmployer.org_name}
              </p>
              <p>
                <strong>Address:</strong> {selectedEmployer.address}
              </p>
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
                    <div className="attendance-row" key={index}>
                      <div>{record.workerUsername}</div>
                      <div>
                        {new Date(record.date).toLocaleDateString("en-GB")}
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
