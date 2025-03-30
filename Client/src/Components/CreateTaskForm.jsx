import React, { useContext, useState } from "react";
import '../CSS/createTaskForm.css'
import { TaskContext } from "../Contexts/TaskContext";
import { createTask, updateTask } from "../Services/task.service";

function CreateTaskForm({onClose, categoryStatus, initialData }) {
  const isEditing = !!initialData;
  
  const { updateTaskCreated, fetchTasks, updateEditedTask  } = useContext(TaskContext);
  const [taskDetails, setTaskDetails] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || categoryStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!taskDetails.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateTask(initialData.id, taskDetails);
        await updateEditedTask(taskDetails);
        fetchTasks();
      } else {
        const response = await createTask(taskDetails);
        if (response.status === 201) {
          updateTaskCreated(response.data);
        }
      }
      fetchTasks(); 
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <h2>{isEditing ? "Edit Task" : `Create Task in ${categoryStatus}`}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              name="title"
              placeholder="Enter Task title"
              value={taskDetails.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Description: </label>
            <textarea
              name="description"
              id=""
              cols="50"
              rows="7"
              value={taskDetails.description}
              placeholder="Enter Task description"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-btns">
          <button 
              type="submit" 
              className="create-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update" : "Create"}
            </button>
            <button type="button" className="close-btn" onClick={() => onClose()}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
