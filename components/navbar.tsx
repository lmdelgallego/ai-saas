"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Personalized AI Newsletter
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <Tooltip >
              <TooltipTrigger>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size={"icon"}
                  className="cursor-pointer hover:bg-transparent hover:text-red-600"
                >
                  <LogOut size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
}