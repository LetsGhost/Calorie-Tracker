'use client';

import Link from "next/link";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { signIn } from "next-auth/react";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submit

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    console.log("Login response:", res);

    if (res?.ok) {
      setMessage("✅ Login successful!");
      window.location.href = "/home"; // redirect manually
    } else {
      console.error("Login failed:", res?.error);
      setMessage("❌ Invalid email or password.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        {/* Logo added above the form */}
        <div className="text-center mb-4">
          <img src="/logo-q.svg" alt="Logo" width="100" height="auto" />
        </div>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        {message && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {message}
          </div>
        )}
        <div className="mt-3 text-center">
          <span>Don’t have an account? </span>
          <Link href="/auth/register" className="link-primary">Register</Link>
        </div>
      </div>
    </div>
  );
}