'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">The page you are looking for does not exist.</p>
      <p className="mt-2 text-sm text-gray-500">Please check the URL or return to the homepage.</p>
      <div className="mt-6">
        <Button>
          <Link href={"/"}>Go to Home Page</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;