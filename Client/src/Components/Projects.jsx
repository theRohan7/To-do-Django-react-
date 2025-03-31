import { ListFilterPlus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { rectIntersection } from '@dnd-kit/core';
import "../CSS/Project.css";
import CreateTaskForm from "./CreateTaskForm";
import { TaskContext } from "../Contexts/TaskContext";
import TaskCard from "./TaskCard";
import TaskDetail from "./TaskDetail";


const DroppableArea = ({ id, children }) => {
  return (
    <div 
      id={id}
      style={{ 
        minHeight: '150px',
        width: '100%',
        padding: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '4px',
      }}
      data-droppable="true"
    >
      {children}
    </div>
  );
};

function Projects() {
  const { tasks, fetchTasks, setTasks } = useContext(TaskContext);
  const [taskForm, setTaskFrom] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

   const TASK_CATEGORIES = ['To Do', 'In Progress', 'Completed']

   const categorizedTasks = TASK_CATEGORIES.map(category => ({
    title: category,
    tasks: tasks.filter(task => task.category === category) || []
  }));

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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTaskById = (id) => {
    const taskId = id.replace("task-", "");
    return tasks.find(task => task.id == taskId);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };


  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTaskId = active.id.replace("task-", "");
    const taskToMove = tasks.find(task => task.id == activeTaskId);
    
    if (!taskToMove) return

    let newCategory = taskToMove.category;

    if (over.id.startsWith("task-")) {
      const overTask = findTaskById(over.id);
      if (overTask) {
        newCategory = overTask.category;
      }
    } else if (over.id.startsWith("list-")) {
      newCategory = over.id.replace("list-", "");
    } else if (over.id.startsWith("empty-")) {
      newCategory = over.id.replace("empty-", "");
    } else if (TASK_CATEGORIES.includes(over.id)) {

      newCategory = over.id;
    }

    if (newCategory !== taskToMove.category) {
      const updatedTasks = tasks.map(task => 
        task.id == activeTaskId ? { ...task, category: newCategory } : task
      );
      
      setTasks(updatedTasks);
    }
    else if (over.id.startsWith("task-") && over.id !== active.id) {
      const overId = over.id.replace("task-", "");
      const updatedTasks = [...tasks];
      const fromIndex = updatedTasks.findIndex(task => task.id == activeTaskId);
      const toIndex = updatedTasks.findIndex(task => task.id == overId);

      if (fromIndex !== -1 && toIndex !== -1) {
        setTasks(arrayMove(updatedTasks, fromIndex, toIndex));
      }
    }

    setActiveId(null);
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
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="tasks-section">
          {categorizedTasks.map((section, index) => (
            <div
              key={index}
              className="task-section"
              id={section.title}
              data-droppable="true"
            >
              <div className="section-header">
                <h2>{section.title}</h2>
                <p>{section.tasks?.length || 0}</p>
              </div>
              <button
                className="add-task-btn"
                onClick={() => openTaskForm(section.title)}
              >
                +
              </button>
              
              {section.tasks.length > 0 ? (
                <SortableContext
                  items={section.tasks.map(task => `task-${task.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div 
                    className="task-list" 
                    id={`list-${section.title}`}
                    style={{ 
                      minHeight: '100px',
                      padding: '8px'
                    }}
                  >
                    {section.tasks.map(taskinfo => (
                      <TaskCard
                        key={taskinfo.id}
                        taskinfo={taskinfo}
                        id={`task-${taskinfo.id}`}
                        onOpenDetail={openTaskDetail}
                      />
                    ))}
                  </div>
                </SortableContext>
              ) : (
                <Droppable id={`empty-${section.title}`}>
                  <DroppableArea id={`empty-${section.title}`}>
                    <p className="empty-list" style={{ 
                      textAlign: 'center', 
                      color: '#888',
                      paddingTop: '40px'
                    }}>
                      No tasks - Drop here
                    </p>
                  </DroppableArea>
                </Droppable>
              )}
            </div>
          ))}
        </div>
        
        {activeId && (
          <DragOverlay>
            {tasks.find(task => `task-${task.id}` === activeId) && (
              <div className="task-card task-card-dragging">
                <div className="task-card-header">
                  <h3>{tasks.find(task => `task-${task.id}` === activeId).title}</h3>
                </div>
              </div>
            )}
          </DragOverlay>
        )}
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


const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id: id
  });
  
  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
};

export default Projects;
