import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
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
              <Link className="nav-link" href="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/log">Log Meal</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/auth/login" onClick={() => signOut()}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}