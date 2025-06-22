import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FoodItem {
  id: string;
  name: string;
  calorie: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface ConfirmAddFoodModalProps {
  food: FoodItem;
  grams: number;
  onGramsChange: (newGrams: number) => void;
  onAdd: () => void;
  onClose: () => void;
}

export default function ConfirmAddFoodModal({
  food,
  grams,
  onGramsChange,
  onAdd,
  onClose,
}: ConfirmAddFoodModalProps) {
  const [message, setMessage] = useState('');

  // Submit the food item with the specified grams
  const submitFood = async () => {
    try {
      // Fetch API call to add the food item
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: food.name,
          calorie: food.calorie,
          protein: food.protein,
          barcode: food.id, // Assuming id is the barcode
          kg: grams,
          origin: 'User Created', // or 'Open Food Facts' based on your logic
        }),
      });
      if (!response.ok) {
        setMessage('Failed to add food item.');
      }

      setMessage('Food item added successfully!');
      onAdd(); // Call the onAdd function to update the state in the parent component
    } catch (error) {
      setMessage('An error occurred while adding the food item.');
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Add</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <h6 className="fw-bold">{food.name}</h6>

            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">Calories: {food.calorie ?? 0}g / 100g</li>
              <li className="list-group-item">Protein: {food.protein ?? 0}g / 100g</li>
              <li className="list-group-item">Carbs: {food.carbs ?? 0}g / 100g</li>
              <li className="list-group-item">Fat: {food.fat ?? 0}g / 100g</li>
            </ul>

            <div className="mb-3">
              <label htmlFor="gramsInput" className="form-label">
                Amount (grams)
              </label>
              <input
                id="gramsInput"
                type="number"
                className="form-control"
                value={grams}
                min={1}
                onChange={(e) => onGramsChange(Number(e.target.value))}
              />
            </div>

            {/* Render message if provided */}
            {message && (
              <div className="alert alert-info mt-3 text-center" role="alert">
                {message}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submitFood}>
              Add to Meal List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}