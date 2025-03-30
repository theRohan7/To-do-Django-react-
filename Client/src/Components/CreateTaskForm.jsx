import React, { useState } from "react";

function CreateTaskForm({onClose}) {
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(taskDetails);
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={taskDetails.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Description: </label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="10"
              value={taskDetails.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-btns">
            <button type="submit">Create</button>
            <button type="button" onClick={() => onClose()}></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
