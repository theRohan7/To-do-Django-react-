import { Ellipsis } from "lucide-react";
import React, { useContext, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../CSS/taskCard.css";
import { TaskContext } from "../Contexts/TaskContext";
import CreateTaskForm from "./CreateTaskForm";

function TaskCard({ taskinfo, id }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { updateDeleteTask, fetchTasks } = useContext(TaskContext);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    console.log(showMenu);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskinfo.id);
      updateDeleteTask(taskinfo.id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  console.log("Rendering TaskCard with ID:", id);

  return (
    <>
      {isEditing ? (
        <CreateTaskForm
          onClose={() => setIsEditing(false)}
          categoryStatus={taskinfo.category}
          initialData={taskinfo}
        />
      ) : (
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="task-card"
        >
          <div className="card-header">
            <h3>{taskinfo.title}</h3>
            <button onClick={toggleMenu} className="menu-btn">
              <Ellipsis />
            </button>
          </div>

          {showMenu && (
            <div className="menu-box">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
              <button>Detail</button>
            </div>
          )}

          <div className="card-body">
            <p>{taskinfo.description}</p>
          </div>
          <div className="card-footer">By: {taskinfo.owner.username}</div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
