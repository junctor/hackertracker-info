"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeMode() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Button variant="ghost" size="icon">
        {theme === "light" ? (
          <MoonIcon
            className="h-5"
            onClick={() => {
              setTheme("dark");
            }}
          />
        ) : (
          <SunIcon
            className="h-5"
            onClick={() => {
              setTheme("light");
            }}
          />
        )}
      </Button>
    </div>
  );
}
