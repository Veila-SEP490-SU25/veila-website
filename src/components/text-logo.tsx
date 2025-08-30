"use client";

import Link from "next/link";

export const TextLogo: React.FC = () => {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <h1 className="text-4xl font-bold font-playfair text-crimson-700 p-2">
        Veila
      </h1>
    </Link>
  );
};
