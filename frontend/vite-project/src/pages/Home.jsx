import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await axiosInstance.post("/users/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      navigate("/", { replace: true });
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-bold text-indigo-600">SST Social</p>
            <p className="text-sm text-slate-500">Your social space</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl bg-indigo-600 px-6 py-10 text-white shadow-sm sm:px-10">
          <p className="text-sm font-medium text-indigo-100">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {user?.name || user?.username || "Your home feed"}
          </h1>
          <p className="mt-3 max-w-xl text-indigo-100">
            Stay connected with your circle and share what matters to you.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Your feed</h2>
          <p className="mt-2 text-slate-500">Your latest posts will appear here.</p>
        </div>
      </section>
    </main>
  );
}

export default Home;