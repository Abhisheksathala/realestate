import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OAuth from './../Components/OAuth';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/user/register", form);
      if (res.data.success) {
        console.log(res.data.message);
        navigate("/sign-in");
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          onChange={handleChange}
          value={form.name}
          placeholder="Username"
          className="border p-3 rounded-lg"
          name="name"
          id="name"
        />
        <input
          type="email"
          onChange={handleChange}
          value={form.email}
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
          id="email"
        />
        <input
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Password"
          className="border p-3 rounded-lg"
          name="password"
          id="password"
        />
        <button
          type="submit"
          className="bg-blue-500 p-3 rounded-lg text-white uppercase hover:opacity-95"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Already have an account?{" "}
          <Link to={"/sign-in"} className="text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignUp;
