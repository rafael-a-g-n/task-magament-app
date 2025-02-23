import React, { useState, useEffect, lazy, Suspense } from 'react';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import { format } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ErrorBoundary from './ErrorBoundary';

const initialCategories = ['Work', 'Personal', 'Shopping', 'Health'];

// Use dynamic import for CategoryFilter
const CategoryFilter = lazy(() => import('./components/CategoryFilter'));

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
      return [];
    }
  });
  const [categories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
      setErrorMessage("Failed to save tasks! Please check your browser settings.");
    }
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks, { ...newTask, id: Date.now().toString() }];
      return newTasks;
    });
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== taskId);
      return newTasks;
    });
  };

  const editTask = (updatedTask) => {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      return newTasks;
    });
  };

  const moveTask = (dragIndex, hoverIndex) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  };

  const filteredTasks =
    selectedCategory === 'All'
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Task Management App</h1>
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          <AddTaskForm addTask={addTask} categories={categories} />
          <Suspense fallback={<div>Loading Category Filter...</div>}>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Suspense>
          <TaskList
            tasks={filteredTasks}
            deleteTask={deleteTask}
            editTask={editTask}
            moveTask={moveTask}
          />
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
}

export default App;
