// components/MealList.tsx
import React from 'react';

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string; // e.g., '08:30 AM'
}

interface MealListProps {
  meals: Meal[];
}

export default function MealList({ meals }: MealListProps) {
  if (meals.length === 0) {
    return (
      <div className="card p-3 shadow">
        <h4 className="mb-3">Todays Meals</h4>
        <div className="alert alert-info">No meals logged yet today.</div>
      </div>
    );
  }

  return (
    <div className="card p-3 shadow">
      <h4 className="mb-3">Todays Meals</h4>
      <ul className="list-group">
        {meals.map(meal => (
          <li
            key={meal.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{meal.name}</strong>
              <div className="text-muted small">{meal.time}</div>
            </div>
            <span className="badge bg-primary rounded-pill">{meal.calories} kcal</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
