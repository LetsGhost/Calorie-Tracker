import React from 'react';

interface Meal {
  _id: string;
  name: string;
  eatenCalories: number; // Updated to match the property name in your data
  protein: number;
  barcode?: string;

  time: string; // ISO timestamp
}

interface MealListProps {
  meals: Meal[];
  onDelete: (id: string) => void; // Callback for delete action
}

export default function MealList({ meals, onDelete }: MealListProps) {
  // Helper function to format time
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as HH:mm
  };

  const submitDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/diarys?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete meal');
      }

      onDelete(id); // Call the onDelete callback to update the UI
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal. Please try again.');
    }
  }

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
            key={meal._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{meal.name}</strong>
              <div className="text-muted small">{formatTime(meal.time)}</div>
            </div>
            <span className="badge bg-primary rounded-pill">{meal.eatenCalories} kcal</span>
            {meal.barcode && (
              <span className="badge bg-secondary rounded-pill ms-2">
                {meal.barcode}
              </span>
            )}
            <span className="badge bg-success rounded-pill ms-2">
              {meal.protein} g protein
            </span>
            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={() => submitDelete(meal._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}