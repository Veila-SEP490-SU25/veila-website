"use client";

import { Nav } from "@/components/header/nav";
import { TextLogo } from "@/components/text-logo";
import { UserNav } from "@/components/header/user-nav";
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <TextLogo />
          <Nav />
          <div className="hidden md:block">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
};
