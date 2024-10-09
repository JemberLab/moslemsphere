"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loading from "@/components/loading";
import Link from "next/link";

export default function ProfilePage() {
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
      <div className="profile-area lg:min-w-[450px] p-4">
        <Avatar className="w-[150px] h-[150px] mx-auto mb-10 shadow-lg shadow-slate-500">
          <AvatarImage src={avatar} alt="avatar" className="cursor-pointer" />
          <AvatarFallback></AvatarFallback>
        </Avatar>

        <div className="profile-block max-w-[300px] mx-auto">
          <Link href="/profile/edit">
            <div className="w-max bg-white text-black rounded-full mx-auto py-2 px-6 font-semibold">Edit Profile</div>
          </Link>
        </div>
      </div>
    );
  }

  return <Loading />;
}
