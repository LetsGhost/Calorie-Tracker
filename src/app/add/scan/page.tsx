'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import Quagga from '@ericblade/quagga2';

// Later add that when no macros are available, the user should be able to add them manually

export default function ScanBarcodePage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productData, setProductData] = useState<any | null>(null);
  const [amountKg, setAmountKg] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      scanImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const scanImage = (dataUrl: string) => {
    Quagga.decodeSingle(
      {
        src: dataUrl,
        numOfWorkers: 0,
        decoder: {
          readers: ['ean_reader', 'code_128_reader', 'upc_reader'],
        },
        locate: true,
      },
      (result) => {
        if (result?.codeResult) {
          const code = result.codeResult.code;
          setScannedResult(code);
          setError(null);
          setMessage('Searching Open Food Facts...');

          fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`)
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 1) {
                setProductData(data.product);
                setMessage(null);
              } else {
                setProductData(null);
                setMessage(null);
                setError('Product not found in Open Food Facts.');
              }
            })
            .catch((err) => {
              console.error(err);
              setProductData(null);
              setMessage(null);
              setError('Error fetching product data.');
            });
        } else {
          setScannedResult(null);
          setProductData(null);
          setError('No barcode detected.');
        }
      }
    );
  };

  const handleAddToMealList = async () => {
    if (!amountKg || isNaN(Number(amountKg))) {
      setMessage('Please enter a valid amount in kg.');
      return;
    }

    const mealData = {
      name: productData?.product_name || 'Unnamed product',
      calorie: productData?.nutriments?.['energy-kcal'] || 0,
      protein: productData?.nutriments?.['proteins'] || 0,
      barcode: scannedResult || '',
      kg: Number(amountKg),
      origin: 'Open Food Facts',
    };

    console.log('Adding to meal list:', mealData);

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Added ${amountKg} kg of ${mealData.name} to your meal list.`);
        setAmountKg('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add meal.');
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      setError('Failed to add meal.');
    }
  };

  // Extract macros safely
  const nutriments = productData?.nutriments;
  const getMacro = (key: string) => nutriments?.[key] ?? 'N/A';

  return (
    <>
      <Head>
        <title>Scan Barcode</title>
      </Head>

      <div className="container py-5">
        <h2 className="text-center mb-4">Upload a Meal Barcode Image</h2>

        <div className="card p-4 shadow mx-auto" style={{ maxWidth: 600 }}>
          <div className="mb-3 text-center">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>

          {imagePreview && (
            <div className="text-center mb-3">
              <img
                src={imagePreview}
                alt="Uploaded preview"
                style={{ maxWidth: '100%', maxHeight: 300 }}
                className="img-fluid border rounded"
              />
            </div>
          )}

          {scannedResult && (
            <div className="alert alert-success text-center">
              <strong>Scanned:</strong> {scannedResult}
            </div>
          )}

          {productData && (
            <div className="mt-3 border rounded p-3 bg-light">
              <h5 className="text-center mb-3">{productData.product_name || 'Unnamed product'}</h5>
              {productData.image_url && (
                <div className="text-center mb-3">
                  <img
                    src={productData.image_url}
                    alt={productData.product_name}
                    style={{ maxHeight: 150 }}
                    className="img-fluid rounded"
                  />
                </div>
              )}

              <p><strong>Brand:</strong> {productData.brands || 'Unknown'}</p>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount (kg)</label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  value={amountKg}
                  onChange={(e) => setAmountKg(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>

              <h6 className="mt-4">Nutritional Values per 100g:</h6>
              <ul className="list-group mb-3">
                <li className="list-group-item">
                  <strong>Calories:</strong> {getMacro('energy-kcal')} kcal
                </li>
                <li className="list-group-item">
                  <strong>Protein:</strong> {getMacro('proteins')} g
                </li>
                <li className="list-group-item">
                  <strong>Fat:</strong> {getMacro('fat')} g
                </li>
                <li className="list-group-item">
                  <strong>Carbohydrates:</strong> {getMacro('carbohydrates')} g
                </li>
              </ul>

              <button onClick={handleAddToMealList} className="btn btn-success w-100">
                Add to Meal List
              </button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center mt-3">{error}</div>
          )}

          {message && (
            <div className="alert alert-info mt-3 text-center" role="alert">
              {message}
            </div>
          )}

          <div className="text-center mt-4">
            <Link href="/" className="btn btn-secondary me-2">
              Cancel
            </Link>
            <button className="btn btn-primary" disabled>
              Scan
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
