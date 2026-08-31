import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosCalls/axios";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const [loader, setLoader] = useState();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoader(true);
    try {
      await axiosInstance.post("/users/register", form);
      console.log("Success")
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-sm">
            S
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Social Media Platform
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Connect. Share. Build your circle.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign up to continue to Social Media Platform.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="name"
                placeholder="Name"
                onChange={handleChange}
                value={form.name}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                username
              </label>
              <input
                id="username"
                name="username"
                type="username"
                placeholder="Username"
                onChange={handleChange}
                value={form.username}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                value={form.email}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
              onClick={handleSubmit}
            >
              Sign up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
