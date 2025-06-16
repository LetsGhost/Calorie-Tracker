// components/CalorieSummary.tsx
import React from 'react';

interface CalorieSummaryProps {
  goal: number;
  consumed: number;
}

export default function CalorieSummary({ goal, consumed }: CalorieSummaryProps) {
  const remaining = goal - consumed;
  const percentage = Math.min((consumed / goal) * 100, 100);

  return (
    <div className="card p-3 shadow">
      <h4 className="mb-3">Todays Calorie Summary</h4>
      <div className="row mb-2">
        <div className="col">
          <strong>Goal:</strong> {goal} kcal
        </div>
        <div className="col">
          <strong>Consumed:</strong> {consumed} kcal
        </div>
        <div className="col">
          <strong>Remaining:</strong> {remaining} kcal
        </div>
      </div>
      <div className="progress">
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Math.floor(percentage)}%
        </div>
      </div>
    </div>
  );
}