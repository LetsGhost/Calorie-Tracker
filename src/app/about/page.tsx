'use client';

import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Calorie Tracker</title>
      </Head>
      <div className="container py-5">
        <h1 className="text-center mb-4">About Us</h1>
        <div className="card shadow p-4">
          <h2>Data Policy</h2>
          <p>
            At Calorie Tracker, we prioritize your privacy. We collect only the
            necessary data to provide you with a personalized experience. Your
            data is securely stored and never shared with third parties without
            your consent.
          </p>
          <h2 className="mt-4">Terms of Service</h2>
          <p>
            By using Calorie Tracker, you agree to our terms of service. This
            includes using the app responsibly, not sharing your account
            credentials, and adhering to applicable laws. We reserve the right
            to suspend accounts that violate these terms.
          </p>
        </div>
      </div>
    </>
  );
}