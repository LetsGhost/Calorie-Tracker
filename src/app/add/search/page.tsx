'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaGlobe } from 'react-icons/fa';

interface FoodItem {
  id: string;
  name: string;
  calorie: number;
  origin?: 'Open Food Facts' | 'User Created';
}

export default function SearchDatabasePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);

  const handleSearch = () => {
    fetch(`/api/meals`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          console.error('Unexpected response format:', data);
          setResults([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching food items:', error);
        setResults([]);
      });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <>
      <Head>
        <title>Search Food Database</title>
      </Head>

      <div className="container py-5">
        <h2 className="text-center mb-4">Search for Food</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="mb-4"
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter food name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <ul className="list-group">
            {results.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong>{' '}
                  {item.origin === 'User Created' ? (
                    <FaUser title="User created" className="text-secondary ms-1" />
                  ) : item.origin === 'Open Food Facts' ? (
                    <FaGlobe title="Open Food Facts" className="text-info ms-1" />
                  ) : null}
                  <div className="text-muted small">{item.calorie} kcal</div>
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