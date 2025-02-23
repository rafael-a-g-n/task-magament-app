import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

const type = 'Task';

const taskVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.03, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", transition: { duration: 0.2 } },
};

function Task({ task, index, deleteTask, editTask, moveTask }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(task.title);
  const [editedDueDate, setEditedDueDate] = React.useState(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
  const [editedCategory, setEditedCategory] = React.useState(task.category);
  const [editedPriority, setEditedPriority] = React.useState(task.priority);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    setMinDate(currentDate);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    editTask({
      ...task,
      title: editedTitle,
      dueDate: editedDueDate,
      category: editedCategory,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDueDate(task.dueDate);
    setEditedCategory(editedCategory);
    setEditedPriority(editedPriority);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      console.log('Drag Index:', dragIndex, 'Hover Index:', hoverIndex);

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      console.log('Hover Middle Y:', hoverMiddleY, 'Hover Client Y:', hoverClientY);

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        console.log('Dragging Down');
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        console.log('Dragging Up');
        return;
      }

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: () => {
      return { id: task.id, index: index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High':
        return '#e57373';
      case 'Medium':
        return '#f0ad4e';
      case 'Low':
        return '#66bb6a';
      default:
        return '#334155';
    }
  };

  const getTitleColor = () => {
    switch (task.priority) {
      case 'High':
        return '#fff';
      case 'Medium':
        return '#333';
      case 'Low':
        return '#333';
      default:
        return '#ff9800';
    }
  };

  const priorityColor = getPriorityColor();
  const titleColor = getTitleColor();

  drag(drop(ref));

  return (
    <motion.li
      ref={ref}
      variants={taskVariants}
      initial="hidden"
      animate="visible"
      {...(isDragging ? {} : { whileHover: "hover" })}
      style={{
        userSelect: 'none',
        padding: 16,
        margin: '10px 0',
        backgroundColor: isDragging ? '#475569' : priorityColor,
        border: '1px solid #ddd',
        opacity: isDragging ? 0.7 : 1,
        cursor: 'grab',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <strong style={{ color: titleColor }}>{task.title}</strong> (Due: {task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : 'No Date'}) - {task.category} - {task.priority}
      </div>
      <div>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              style={{ marginBottom: '5px', width: '100%' }}
              aria-label="Edit task title"
            />
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              min={minDate}
              style={{ marginBottom: '5px', width: '100%' }}
              aria-label="Edit task due date"
            />
            <select value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} style={{ marginBottom: '5px', width: '100%' }} aria-label="Edit task category">
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
            <select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)} style={{ marginBottom: '10px', width: '100%' }} aria-label="Edit task priority">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button onClick={handleSave} style={{ marginRight: '10px' }} aria-label="Save edited task">Save</button>
              <button onClick={handleCancel} aria-label="Cancel editing task">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={handleEdit} style={{ marginLeft: 10 }} aria-label="Edit task" title="Edit task">Edit</button>
            <button onClick={handleDelete} style={{ marginLeft: 5, backgroundColor: 'red' }} aria-label="Delete task" title="Delete task">Delete</button>
          </div>
        )}
      </div>
    </motion.li>
  );
}

export default Task;
