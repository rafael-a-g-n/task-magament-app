import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

function AddTaskForm({ addTask, categories }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [priority, setPriority] = useState('Medium');
  const [titleError, setTitleError] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    setMinDate(currentDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      setTitleError('Task title is required');
      return;
    }

    addTask({ title, dueDate, category, priority });
    setTitle('');
    setDueDate('');
    setCategory(categories[0] || '');
    setPriority('Medium');
    setTitleError('');
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      style={{
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        style={{
          marginBottom: '10px',
          width: '80%',
          marginRight: '0',
        }}
        aria-label="Task title"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        min={minDate}
        style={{
          marginBottom: '10px',
          width: '80%',
          marginRight: '0',
        }}
        aria-label="Task due date"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          marginBottom: '10px',
          width: '80%',
          marginRight: '0',
        }}
        aria-label="Task category"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{
          marginBottom: '10px',
          width: '80%',
          marginRight: '0',
        }}
        aria-label="Task priority"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit" style={{ width: '80%' }} aria-label="Add task">
        Add Task
      </button>
      {titleError && (
        <p style={{ color: '#ff4d4f', marginTop: '5px' }} aria-live="assertive">{titleError}</p>
      )}
    </motion.form>
  );
}

export default AddTaskForm;
