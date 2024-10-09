"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/components/loading";
import { ProfileForm } from "./form";

export default function ProfileEditPage() {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>("");

  useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error.message);
      return;
    }

    if (!session) {
      window.location.href = "/login";
    } else {
      setTimeout(() => {
        setUser(session.user);
        setAvatar(
          `https://api.dicebear.com/9.x/avataaars-neutral/svg?radius=50&backgroundColor=ffdfbf&seed=${session.user.email}`
        );
      }, 1000);
    }
  };

  if (user) {
    return (
      <div className="profile-block w-full sm:max-w-[300px] mx-auto">
        <ProfileForm />
      </div>
    );
  }

  return <Loading />;
}
