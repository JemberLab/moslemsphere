"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHECK_EMAIL_EXISTS, USER_ADD, USER_PROFILE_ADD } from "@/services/user";

const Signup = () => {
  // const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentTime = () => new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

  const handleSignup = async () => {
    setError(null);
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const emailExists = await CHECK_EMAIL_EXISTS(email);
      if (emailExists) {
        setError("Email already registered.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      if (data?.user) {
        const userdata = {
          user_id: data.user.id,
          email: data.user.email,
          created_at: getCurrentTime(),
        };
        await USER_ADD(userdata);
        await USER_PROFILE_ADD(userdata);
        // router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-220px)]">
      <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center">Create your account</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          <Input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <Input
            required
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            onClick={handleSignup}
            className={`w-full py-2 outline-none border-none ${loading && "opacity-50 cursor-not-allowed"}`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </div>

        <div className="text-center">
          Already have an account?
          <a href="/login" className="text-blue-500 hover:underline mx-2">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
