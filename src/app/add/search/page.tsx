// pages/add/search.tsx
'use client';
import Head from 'next/head';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
}

export default function SearchDatabasePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with actual database search logic
    setResults([
      { id: '1', name: 'Banana', calories: 105 },
      { id: '2', name: 'Apple', calories: 95 },
      { id: '3', name: 'Chicken Breast (100g)', calories: 165 },
    ]);
  };

  return (
    <>
      <Head>
        <title>Search Food Database</title>
      </Head>

      <div className="container py-5">
        <h2 className="text-center mb-4">Search for Food</h2>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter food name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </div>
        </form>

        {results.length > 0 && (
          <ul className="list-group">
            {results.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong>
                  <div className="text-muted small">{item.calories} kcal</div>
                </div>
                <button className="btn btn-success btn-sm">Add</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}