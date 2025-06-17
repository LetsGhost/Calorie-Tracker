'use client';
import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import CalorieSummary from '../components/CalorieSummary';
import MealList from '../components/MealList';
import { useState } from 'react';

export default function HomePage() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
    <>
      <Head>
        <title>Calorie Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          integrity="sha384-ENjdO4Dr2bkBIFxQpeoYXQtmI6E+z6Dk9H2aG7Ylo5zF5CBbfzMJ0GM1ylcGZ+eY"
          crossOrigin="anonymous"
        />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" href="/">Calorie Tracker</Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${isNavCollapsed ? '' : ' show'}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/log">Log Meal</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/log">Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <h1 className="mb-4 text-center">My Calorie Tracker</h1>

        <div className="mb-4">
          <CalorieSummary goal={2200} consumed={1350} />
        </div>

        <div className="mb-4">
          <MealList meals={[]} />
        </div>

        <div className="text-center">
          <Link href="/log" className="btn btn-success" >
            + Add Meal
          </Link>
        </div>
      </div>
    </>
  );
}