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

function Projects() {
  const { tasks, fetchTasks, setTasks } = useContext(TaskContext);
  const [taskForm, setTaskFrom] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [activeId, setActiveId] = useState(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    console.log("Drag started:", event);
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("Drag ended:", event);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

  
    const taskId = activeId.replace("task-", "");
    
  
    const taskToMove = tasks.find(task => task.id === taskId);
    if (!taskToMove) return;

  
    let newCategory = "";
    

    for (const section of taskSections) {
      if (section.status === overId) {
        newCategory = section.status;
        break;
      }
    }
    

    if (!newCategory) {
      for (const section of taskSections) {
        if (section.tasks.some(task => `task-${task.id}` === overId)) {
          newCategory = section.status;
          break;
        }
      }
    }
    
    // If we found a new category, update the task
    if (newCategory) {
      // Update the state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, category: newCategory } 
            : task
        )
      );
    }
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
    </div>
  );
}

export default Projects;