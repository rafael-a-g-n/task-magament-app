import React from 'react';
import { motion } from 'framer-motion';

const filterVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <motion.div
      variants={filterVariants}
      initial="hidden"
      animate="visible"
      style={{
        marginBottom: '20px',
        textAlign: 'center',
      }}
    >
      <label htmlFor="category-select" style={{ marginRight: '10px' }}>
        Filter by Category:
      </label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          width: '60%',
          padding: '8px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#334155',
          color: '#fff',
          cursor: 'pointer',
        }}
        aria-label="Filter tasks by category"
      >
        <option key="all" value="All">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </motion.div>
  );
}

export default CategoryFilter;
