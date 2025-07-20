'use client';

import { useState } from 'react';

export default function CompleteUserInfo() {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    calorieGoal: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { height, weight, age, calorieGoal } = formData;

    if (!height || !weight || !age || !calorieGoal) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('/api/userInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ height, weight, age, calorieGoal }),
      });

      if (res.ok) {
        setMessage('✅ User info saved successfully!');
        setFormData({ height: '', weight: '', age: '', calorieGoal: '' });
        // Redirect or perform further actions
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ An unexpected error occurred.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 500, width: '100%' }}>
        <h2 className="mb-4 text-center">One More Step Before You Continue</h2>
        <p className="text-muted text-center mb-4">
          Please provide your information to personalize your experience.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="height" className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-control"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="weight" className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-control"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="calorieGoal" className="form-label">Calorie Goal (kcal)</label>
            <input
              type="number"
              className="form-control"
              id="calorieGoal"
              name="calorieGoal"
              value={formData.calorieGoal}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Save and Continue</button>
        </form>
        {message && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}