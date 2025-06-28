'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { JWTPayload } from "jose";
import UserMenu from "../auth/UserMenu";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps{
  sessionData?: JWTPayload | null;
}

function Header({sessionData}: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Create Post", href: "/post/create-post" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-background border-b border-muted sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary hover:text-primary/90 transition-colors">
            Blog
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((navlink) => (
              <Link
                key={navlink.href}
                href={navlink.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                )}
              >
                {navlink.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>

          <div>
            {
              sessionData ? <UserMenu user={sessionData}/> : (
                <Button variant="default" size="sm" className="rounded-lg shadow hover:shadow-md transition-shadow">
                  <Link className="cursor-pointer" href="/auth">
                    Login
                  </Link>
                </Button>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
