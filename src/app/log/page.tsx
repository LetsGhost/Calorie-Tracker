// components/AddMealOptions.tsx
import React from 'react';
import Link from 'next/link';

export default function AddMealOptions() {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Add a Meal</h2>
      <div className="row g-4 justify-content-center">
        <div className="col-md-4">
          <Link href="/add/barcode" className="text-decoration-none">
            <div className="card h-100 text-center p-4 shadow-sm">
              <h4 className="mb-3">📷 Scan Barcode</h4>
              <p className="text-muted">Use your camera to scan a food barcode and log it quickly.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link href="/add/manual" className="text-decoration-none">
            <div className="card h-100 text-center p-4 shadow-sm">
              <h4 className="mb-3">✍️ Manual Add</h4>
              <p className="text-muted">Enter meal name and calories manually.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link href="/add/search" className="text-decoration-none">
            <div className="card h-100 text-center p-4 shadow-sm">
              <h4 className="mb-3">🔍 Search Database</h4>
              <p className="text-muted">Search our food database to add known meals.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
