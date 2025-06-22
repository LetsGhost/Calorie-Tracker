'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaGlobe } from 'react-icons/fa';
import ConfirmAddFoodModal from '../../components/AddFoodSearch';

interface FoodItem {
  id: string;
  name: string;
  calorie: number;
  origin?: 'Open Food Facts' | 'User Created';
}

export default function SearchDatabasePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null); // State for selected food
  const [grams, setGrams] = useState(100); // Default grams for the modal

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

  const handleAddClick = (food: FoodItem) => {
    setSelectedFood(food); // Set the selected food item
  };

  const handleModalClose = () => {
    setSelectedFood(null); // Close the modal
  };

  const handleAddToMealList = () => {
    console.log(`Adding ${grams} grams of ${selectedFood?.name} to the meal list.`);
    // Add logic to update the meal list or send data to the server
    handleModalClose(); // Close the modal after adding
  };

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

        <ul className="list-group">
          {results.map((item) => (
            <li
              key={item.id} // Ensure `item.id` is unique
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
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAddClick(item)} // Trigger modal
              >
                Add
              </button>
            </li>
          ))}
        </ul>

        {selectedFood && (
          <ConfirmAddFoodModal
            food={selectedFood}
            grams={grams}
            onGramsChange={setGrams}
            onAdd={handleAddToMealList}
            onClose={handleModalClose}
          />
        )}
      </div>
    </>
  );
}