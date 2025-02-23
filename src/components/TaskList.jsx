import React from 'react';
import Task from './Task';

function TaskList({ tasks, deleteTask, editTask, moveTask }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          index={index}
          task={task}
          deleteTask={deleteTask}
          editTask={editTask}
          moveTask={moveTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
