import React, { createContext, useState, useCallback } from "react";
import { chnageTaskCategory, fetchAllTasks } from "../Services/task.service";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetchAllTasks();
      setTasks(response || []);
    } catch (error) {
      console.error(error.message || "Failed to fetch tasks");
      setTasks([]);
    }
  }, []);

  const updateDeleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId && task.id !== taskId));
  }, []);

  const updateTaskCreated = useCallback((newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); 
  }, []);

  const updateEditedTask = useCallback((updatedTask) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        (task._id === updatedTask._id || task.id === updatedTask.id) ? updatedTask : task
      );
    });
  }, []);


  const updateTaskCategory = useCallback(async(taskId, newCategory) => {    
    try {
      const taskToUpdate = tasks.find(task => task._id == taskId || task.id == taskId);
      
      if (!taskToUpdate) {
        console.error("Task not found:", taskId);
        return;
      }

      await chnageTaskCategory(taskId, newCategory);

      setTasks(prevTasks =>
        prevTasks.map(task =>
          (task._id == taskId || task.id == taskId)
            ? { ...task, category: newCategory }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task category:", error);
    }
  }, [tasks]);



  return (
    <TaskContext.Provider
      value={{ tasks,setTasks, fetchTasks, updateTaskCreated, updateDeleteTask, updateEditedTask, updateTaskCategory }}
    >
      {children}
    </TaskContext.Provider>
  );



};
