import React, { useEffect, useState } from "react";
import "./TrackStatus.css";
import StatusBadge from "./StatusBadge";
import API from "../api/axios";

const TrackStatus = () => {
  const [issues, setIssues] = useState([]);

 useEffect(() => {
  fetchIssues();

  const interval = setInterval(() => {
    fetchIssues();
  }, 3000);

  return () => clearInterval(interval);
}, []);

  const fetchIssues = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await API.get("/issues");

      // ✅ filter only current user issues
      const myIssues = res.data.filter(
        (issue) => issue.user?._id === user?._id
      );

      setIssues(myIssues);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="track-page">
      <h2>Track Your Issues</h2>

      <div className="issue-table">
        <div className="table-header">
          <span>Title</span>
          <span>Department</span>
          <span>Date</span>
          <span>Status</span>
          <span>Resolved By</span>
        </div>

        {issues.map((issue) => (
          <div className="table-row" key={issue._id}>
            <span>{issue.title}</span>
            <span>{issue.department}</span>

            <span>
              {new Date(issue.createdAt).toLocaleDateString()}
            </span>

            <StatusBadge status={issue.status} />

            <span>
              {issue.status === "Resolved"
                ? issue.resolvedBy?.fullName || "Admin"
                : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackStatus;