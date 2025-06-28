'use client'

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from "next-themes";
import Header from "../layouts/header";
import { cn } from "@/lib/utils";

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  containerClassName?: string;
}

function ThemeProvider({ children, containerClassName, ...props }: ExtendedThemeProviderProps) {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        setSessionData(data.session);
        console.log("Session data:", data.session);
      })
      .catch(error => {
        console.error("Error fetching session:", error);
      });
  }, []);

  return (
    <NextThemeProvider {...props}>
      <Header sessionData={sessionData} />
      <main className={cn('container mx-auto px-4', containerClassName)}>
        {children}
      </main>
    </NextThemeProvider>
  );
}

export default ThemeProvider;