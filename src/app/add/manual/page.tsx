// components/AddManualMeal.tsx
'use client';
import React, { useState } from 'react';

interface MealFormData {
  name: string;
  calories: number;
  protein: number;
  time: string;
}

export default function AddManualMeal() {
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    calories: 0,
    protein: 0,
    time: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'calories' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted meal:', formData);
    // TODO: Send to API
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Manually Add a Meal</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow mx-auto" style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Meal Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="calories" className="form-label">Calories</label>
          <input
            type="number"
            className="form-control"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="protein" className="form-label">Calories</label>
          <input
            type="number"
            className="form-control"
            id="protein"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Save Meal</button>
      </form>
    </div>
  );
}
