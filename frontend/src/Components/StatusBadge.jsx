import "./StatusBadge.css";

const StatusBadge = ({ status }) => {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      {status === "Resolved" ? "✔ Resolved" : status}
    </span>
  );
};

export default StatusBadge;

