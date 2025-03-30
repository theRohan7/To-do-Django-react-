import { ListFilterPlus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import "../CSS/Project.css";
import CreateTaskForm from "./CreateTaskForm";
import { TaskContext } from "../Contexts/TaskContext";
import TaskCard from "./TaskCard";
import TaskDetail from "./TaskDetail";

function Projects() {
  const { tasks, fetchTasks, setTasks } = useContext(TaskContext);
  const [taskForm, setTaskFrom] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const taskSections = [
    {
      title: "To Do",
      status: "To Do",
      tasks: tasks?.filter((task) => task.category === "To Do"),
    },
    {
      title: "In Progress",
      status: "In Progress",
      tasks: tasks?.filter((task) => task.category === "In Progress"),
    },
    {
      title: "Completed",
      status: "Completed",
      tasks: tasks?.filter((task) => task.category === "Completed"),
    },
  ];

  const openTaskForm = (sectionStatus) => {
    setCurrentSection(sectionStatus);
    setTaskFrom(true);
  };

  const closeTaskForm = () => {
    setTaskFrom(false);
  };

  const openTaskDetail = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetail = () => {
    setSelectedTask(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    console.log("Drag ended:", event);
    console.log("Over ID:", over.id);

    const activeId = active.id.replace("task-", "");

    const taskToMove = tasks.find((task) => task.id == activeId);
    if (!taskToMove) return;

    let newCategory = taskToMove.category;

    if (over.id.startsWith("task-")) {
      // Dropped on another task - find that task's category
      const overTaskId = over.id.replace("task-", "");
      const overTask = tasks.find((task) => task.id == overTaskId);

      if (overTask) {
        newCategory = overTask.category;
      }
    } else {
      // This might be a section list or other element
      // Check if it's one of our sections by ID
      const sectionMatch = taskSections.find(
        (section) => section.status === over.id
      );
      if (sectionMatch) {
        newCategory = sectionMatch.status;
      } else if (over.id.startsWith("list-")) {
        // If it's a list container with our custom ID format
        const listCategory = over.id.replace("list-", "");
        const sectionMatch = taskSections.find(
          (section) => section.status === listCategory
        );
        if (sectionMatch) {
          newCategory = sectionMatch.status;
        }
      }
    }

    // Update the task category if changed
    if (newCategory !== taskToMove.category) {
      console.log(`Moving task from ${taskToMove.category} to ${newCategory}`);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id == activeId ? { ...task, category: newCategory } : task
        )
      );
    }
    // Reorder within the same category
    else if (over.id.startsWith("task-")) {
      const overId = over.id.replace("task-", "");
      const updatedTasks = [...tasks];
      const fromIndex = updatedTasks.findIndex((task) => task.id == activeId);
      const toIndex = updatedTasks.findIndex((task) => task.id == overId);

      if (fromIndex !== -1 && toIndex !== -1) {
        setTasks(arrayMove(updatedTasks, fromIndex, toIndex));
      }
    }
  };

  const findContainer = (id) => {
    if (id.startsWith("list-")) {
      return id.replace("list-", "");
    }

    if (id.startsWith("task-")) {
      const taskId = id.replace("task-", "");
      const task = tasks.find((t) => t.id == taskId);
      return task ? task.category : null;
    }

    const section = taskSections.find((s) => s.status === id);
    return section ? section.status : null;
  };

  return (
    <div className="project-main">
      <div className="project-header">
        <h1>Projects</h1>
        <button>
          <ListFilterPlus /> Filter
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <div className="tasks-section">
          {taskSections.map((section, idx) => (
            <div
              key={idx}
              className="task-section"
              id={section.status}
              data-droppable="true"
            >
              <div className="section-header">
                <h2>{section.title}</h2>
                <p>{section.tasks?.length || 0}</p>
              </div>
              <button
                className="add-task-btn"
                onClick={() => openTaskForm(section.status)}
              >
                +
              </button>
              <SortableContext
                items={section.tasks?.map((task) => `task-${task.id}`) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="task-list">
                  {section.tasks?.map((taskinfo) => (
                    <TaskCard
                      key={taskinfo.id}
                      taskinfo={taskinfo}
                      id={`task-${taskinfo.id}`}
                      onOpenDetail={openTaskDetail}
                    />
                  ))}
                  {section.tasks?.length === 0 && (
                    <p className="empty-list">No tasks</p>
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
      {taskForm && (
        <CreateTaskForm
          onClose={closeTaskForm}
          categoryStatus={currentSection}
        />
      )}

      {selectedTask && (
        <div className="task-detail-overlay">
          <TaskDetail taskID={selectedTask.id} onClose={closeTaskDetail} />
        </div>
      )}
    </div>
  );
}

export default Projects;
