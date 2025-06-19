'use client';

import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import CalorieSummary from '../components/CalorieSummary';
import MealList from '../components/MealList';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [lastCalories, setLastCalories] = useState(0);
  const [diaryData, setDiaryData] = useState(null);

  // Fetch the user's diary data
  const fetchDiaryData = async () => {
    try {
      const response = await fetch('/api/diarys');
      if (!response.ok) {
        throw new Error('Failed to fetch diary data');
      }
      const data = await response.json();
      setDiaryData(data);

      // Get the last value of the calories array
      if (data.calories && data.calories.length > 0) {
        setLastCalories(data.calories[data.calories.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Use useEffect to fetch data on page load
  useEffect(() => {
    if (session) {
      fetchDiaryData();
    }
  }, [session]);

  // Handle loading and redirect cases
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    redirect("/auth/login");
    return null; // Ensure the component returns null after redirect
  }

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

      

      <div className="container py-5">
        <h1 className="mb-4 text-center">My Calorie Tracker</h1>

        <div className="mb-4">
          <CalorieSummary goal={2200} consumed={lastCalories} />
        </div>

        <div className="mb-4">
          <MealList meals={diaryData?.mealList || []} />
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