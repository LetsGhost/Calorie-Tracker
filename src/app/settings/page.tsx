'use client';
import Head from 'next/head';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState({
    height: '',
    weight: '',
    age: '',
    calorieGoal: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    // Here you would typically send the userInfo to your API
    const res = await fetch('/api/userInfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    });

    if (res.ok) {
      console.log('Settings saved successfully');
    } else {
      console.log('Failed to save settings');
    }
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <div className="container py-5">
        <h2 className="mb-4 text-center">Settings</h2>

        {/* User Info Section */}
        <div className="card shadow mb-4">
          <div className="card-header">
            <h5 className="mb-0">User Information</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="height" className="form-label">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  className="form-control"
                  value={userInfo.height}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="weight" className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="form-control"
                  value={userInfo.weight}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="age" className="form-label">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="form-control"
                  value={userInfo.age}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="calorieGoal" className="form-label">Calorie Goal (kcal)</label>
                <input
                  type="number"
                  id="calorieGoal"
                  name="calorieGoal"
                  className="form-control"
                  value={userInfo.calorieGoal}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Save Settings</button>
            </form>
          </div>
        </div>

        {/* Placeholder for future settings sections */}
        <div className="card shadow">
          <div className="card-header">
            <h5 className="mb-0">More Settings (Coming Soon)</h5>
          </div>
          <div className="card-body">
            <p className="text-muted">You’ll be able to customize more features here later.</p>
          </div>
        </div>
      </div>
    </>
  );
}
