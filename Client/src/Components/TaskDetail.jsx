import React, { useEffect, useState } from "react";
import { fetchTaskDetails } from "../Services/task.service";
import "../CSS/taskDetail.css";

function TaskDetail({ taskID, onClose }) {
  const [taskDetails, setTaskDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        const response = await fetchTaskDetails(taskID);
        setTaskDetails(response);
      } catch (error) {
        throw new Error(error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    };

    getTaskDetails();
  }, []);

  console.log(taskDetails);

  return (
    <div className="details-container">
      <div className="details-box">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="detail-group">
          <h3>Task Title:</h3>
          <h2>{taskDetails.title}</h2>
        </div>
        <div className="detail-group">
          <h3>Task Description:</h3>
          <p>{taskDetails.description}</p>
        </div>
        <div className="detail-group">
          <h3>Task Category:</h3>
          <span>{taskDetails.category}</span>
        </div>
        <div className="detail-group row">
          <div className="owner">
            <h3>Task Owner:</h3>
            <p>{taskDetails.owner?.username}</p>
          </div>
          <div className="timeline">
            <h3>Last Updated:</h3>
            <p>{new Date(taskDetails.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
