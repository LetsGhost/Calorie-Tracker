import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">Email address</label>
            <input type="email" className="form-control" id="loginEmail" required />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Password</label>
            <input type="password" className="form-control" id="loginPassword" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          <span>Dont have an account? </span>
          <Link href="/auth/register" className="link-primary">Register</Link>
        </div>
      </div>
    </div>
  );
}