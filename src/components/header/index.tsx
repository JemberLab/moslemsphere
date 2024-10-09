"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { handleLogout, supabase } from "../../utils/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>("");
  const [authMode, setAuthMode] = useState<any>(false);

  useEffect(() => {
    const currentUrl = window.location.pathname;
    if (currentUrl == "/login" || currentUrl == "/signup") setAuthMode(true);
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
      // if (currentUrl !== "/login" && currentUrl !== "/signup") {
      //   window.location.href = "/login";
      // }
    } else {
      setUser(session.user);
      setAvatar(
        `https://api.dicebear.com/9.x/avataaars-neutral/svg?radius=50&backgroundColor=ffdfbf&seed=${session.user.email}`
      );
    }
  };

  const ShowContent = () => {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={avatar} alt="avatar" className="cursor-pointer" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] -translate-x-[24px] font-semibold" side="bottom" sideOffset={12}>
            <Link href="/profile" passHref>
              <DropdownMenuItem className="cursor-pointer text-base">
                <span className="flex items-center">
                  <DropdownMenuShortcut className="opacity-100 ml-0">
                    <User strokeWidth={3} className="mr-3" />
                  </DropdownMenuShortcut>
                  Profile
                </span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href="/settings" passHref>
              <DropdownMenuItem className="cursor-pointer text-base">
                <span className="flex items-center">
                  <DropdownMenuShortcut className="opacity-100 ml-0">
                    <Settings strokeWidth={3} className="mr-3" />
                  </DropdownMenuShortcut>
                  Settings
                </span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-base">
              <DropdownMenuShortcut className="opacity-100 ml-0">
                <LogOut color="orange" strokeWidth={3} className="mr-3" />
              </DropdownMenuShortcut>
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };

  if (authMode) return <></>;

  return (
    <header>
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" passHref>
          <h1 className="cursor-pointer text-2xl font-bold">Maple</h1>
        </Link>
        <ShowContent />
      </nav>
    </header>
  );
}

export default Header;
