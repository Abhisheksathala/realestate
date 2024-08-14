import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  SignInFailure,
  SignInStart,
  SignInSuccess,
} from "../redux/User/UserSlice";
import OAuth from "../Components/OAuth";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SignInStart());

    try {
      const res = await axios.post("/api/user/login", form);
      console.log(res);

      if (res.data.success) {
        console.log(res.data.message);
        dispatch(SignInSuccess(res.data));
        navigate("/");
      } else {
        dispatch(SignInFailure(res.data.message));
      }
    } catch (error) {
      dispatch(SignInFailure(error.message));
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          Don't have an account?
          <Link to={"/sign-up"} className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Signin;
