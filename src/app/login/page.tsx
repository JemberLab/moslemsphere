"use client";

import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data);

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/about";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-220px)]">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?
          <a href="/signup" className="text-blue-500 hover:underline mx-2">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
