import { useEffect, useState } from "react";
import "./TrackStatus.css";
import StatusBadge from "./StatusBadge";
import API from "../api/axios";

const CACHE_KEY = "my_issues";

const TrackStatus = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Load from localStorage instantly on mount
  const [issues, setIssues] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await API.get("/issues");
      const myIssues = res.data.filter((issue) => issue.user?._id === user?._id);

      setIssues(myIssues);
      // Cache the user's own issues
      localStorage.setItem(CACHE_KEY, JSON.stringify(myIssues));
    } catch (error) {
      // If API fails, cached data is already shown
      console.log("Using cached issues");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-page">
      <div className="track-header">
        <h2>Track Your Issues</h2>
        <p>Real-time status updates for all your submitted issues</p>
      </div>

      <div className="issue-table">
        <div className="table-header">
          <span>Title</span>
          <span>Department</span>
          <span>Priority</span>
          <span>Date</span>
          <span>Status</span>
          <span>Resolved By</span>
        </div>

        {loading && issues.length === 0 ? (
          <div className="empty-state"><p>Loading...</p></div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: "40px" }}>📋</div>
            <p>No issues submitted yet</p>
          </div>
        ) : (
          issues.map((issue) => (
            <div className="table-row" key={issue._id}>
              <span>{issue.title}</span>
              <span>{issue.department}</span>
              <span>{issue.priority}</span>
              <span>{new Date(issue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              <StatusBadge status={issue.status} />
              <span>{issue.status === "Resolved" ? "✅ Admin" : "—"}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrackStatus;
