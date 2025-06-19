// components/AddManualMeal.tsx
'use client';
import React, { useState } from 'react';

interface MealFormData {
  name: string;
  calories: number;
  protein: number;
  time: string;
  barcode: string;
  kg: number;
}

export default function AddManualMeal() {
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    calories: 0,
    protein: 0,
    barcode: '',
    time: '',
    kg: 0,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert calories and protein to integers
    setFormData(prev => ({
      ...prev,
      [name]: name === 'calories' || name === 'protein' ? parseInt(value) : value === 'kg' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, calories, protein, barcode } = formData;
    if (!name || !calories || !protein || !formData.kg) {
      setMessage('Please fill in all required fields.');
      return;
    }
    setMessage('Saving meal...');
    fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        calorie: calories,
        protein,
        barcode: barcode || '',
        time: new Date().toISOString(),
        kg: formData.kg,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save meal' + `: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        setMessage(`Meal "${data.name}" saved successfully!`);
        setFormData({ name: '', calories: 0, protein: 0, barcode: '', time: '', kg: 0 }); // Reset form
      })
      .catch(err => {
        console.error(err);
        setMessage(`❌ ${err.message}`);
      });
  };

  return (
  <div className="container py-5">
    <h2 className="text-center mb-4">Manually Add a Meal</h2>

    <div className="card p-4 shadow mx-auto" style={{ maxWidth: 500 }}>
    <form onSubmit={handleSubmit}>
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
        <label htmlFor="calories" className="form-label">Calories per 100g</label>
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
        <label htmlFor="protein" className="form-label">Protein per 100g</label>
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

      <div className="mb-3">
        <label htmlFor="kg" className="form-label">Weight of your food</label>
        <input
          type="number"
          className="form-control"
          id="kg"
          name="kg"
          value={formData.kg}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="barcode" className="form-label">Barcode</label>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-primary me-3"
            onClick={() => {
              alert("Open camera (not implemented)");
            }}
          >
            📷
          </button>
          <input
            type="text"
            className="form-control"
            id="barcode"
            name="barcode"
            placeholder="Scanned result or text output"
            readOnly
            value={formData.barcode}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-success w-100">Save Meal</button>
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
