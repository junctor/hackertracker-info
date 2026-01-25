import React from "react";
import Countdown from "@/features/home/Countdown";
import Image from "next/image";
import dcsLogo from "../../../public/images/dcsingapore.webp";
import localFont from "next/font/local";
import { getSiteMenu } from "@/lib/menu";
import Link from "next/link";

const museoFont = localFont({
  src: "../../../public/fonts/Museo700-Regular.woff2",
  display: "swap",
  variable: "--font-museo",
});

const navMenu = getSiteMenu("dcsg2026");

export default function Splash() {
  return (
    <main className="py-16 max-w-6xl mx-auto px-4">
      {/* Hero */}
      <div className="text-center space-y-4 align-middle items-center justify-center flex flex-col">
        <Image src={dcsLogo} alt="DEF CON Singapore 2026" priority />

        {/* Date */}
        <time
          dateTime="2026-04-28"
          className={`text-xs sm:text-sm md:text-base text-gray-300/90 uppercase tracking-[0.16em] sm:tracking-[0.22em] ${museoFont.className}`}
        >
          April 28–30, 2026
        </time>

        {/* Countdown */}
        <Countdown />
      </div>
      {/* Menu */}
      <section className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {navMenu.map((item) => {
          const Icon = item.icon;
          const isExternal = item.href.startsWith("http");

          return isExternal ? (
            <a
              key={item.sort_order}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
              className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              <Icon className="h-6 w-6 mb-2 text-gray-200" />
              <span className="text-sm font-semibold text-gray-100">
                {item.title}
              </span>
            </a>
          ) : (
            <Link
              key={item.sort_order}
              href={item.href}
              aria-label={item.title}
              className="flex flex-col items-center justify-center p-5 bg-gray-800 rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              <Icon className="h-6 w-6 mb-2 text-gray-200" />
              <span className="text-sm font-semibold text-gray-100">
                {item.title}
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
