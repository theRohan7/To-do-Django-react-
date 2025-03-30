import { Ellipsis } from "lucide-react";
import React, { useContext, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../CSS/taskCard.css";
import { TaskContext } from "../Contexts/TaskContext";
import CreateTaskForm from "./CreateTaskForm";
import { deleteTask } from "../Services/task.service";

function TaskCard({ taskinfo, onOpenDetail  }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `task-${taskinfo.id}` });
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { updateDeleteTask, fetchTasks } = useContext(TaskContext);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
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

  const handleDetail = () => {
    setShowMenu(false);
    onOpenDetail(taskinfo); // Open detail view
  };

  return (
    <>
      {isEditing ? (
        <CreateTaskForm
          onClose={() => setIsEditing(false)}
          categoryStatus={taskinfo.category}
          initialData={taskinfo}
        />
      ) : (
        <div ref={setNodeRef} style={style} className="task-card">
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
              <button onClick={handleDetail}>Detail</button>
            </div>
          )}

          <div className="card-body">
            <p>{taskinfo.description}</p>
          </div>

          <div className="card-footer">
            <div className="drag-handle" {...attributes} {...listeners}>
              ⠿
            </div>
            <p> <img src="https://res-console.cloudinary.com/rohanscloud/thumbnails/v1/image/upload/v1743343086/RWxsaXBzZV8yN19hcmtkdm8=/preview" alt="" /> {taskinfo.owner.username}</p>
           
          </div>
        </div>
      )}
    </>
  );
}

export default TaskCard;
