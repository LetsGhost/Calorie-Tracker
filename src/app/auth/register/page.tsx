'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        setMessage(`User ${user.email} registered successfully.`);
        setEmail('');
        setPassword('');
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error}`);
      }
    } catch (err) {
      setMessage(err + ', An unexpected error occurred.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="registerEmail" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="registerEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="registerPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="registerPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        {message && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {message}
          </div>
        )}
        <div className="mt-3 text-center">
          <span>Already have an account? </span>
          <Link href="/auth/login" className="link-primary">Login</Link>
        </div>
      </div>
    </div>
  );
}
