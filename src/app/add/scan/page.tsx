'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import Quagga from '@ericblade/quagga2';

export default function ScanBarcodePage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
          readers: ['ean_reader', 'code_128_reader', 'upc_reader'], // Add others if needed
        },
        locate: true,
      },
      (result) => {
        if (result && result.codeResult) {
          setScannedResult(result.codeResult.code);
          setError(null);
        } else {
          setScannedResult(null);
          setError('No barcode detected.');
        }
      }
    );
  };

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

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <div className="text-center">
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
