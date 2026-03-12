"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Gracefully handle session - return null if auth fails (auth is optional)
  const { data: session, status } = useSession({
    required: false,
  });
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation: Array<{ name: string; href: string }> = [];
  
  // During SSR and initial hydration, render consistent content
  // Only show authenticated content after component has mounted and session is loaded
  const isAuthenticated = mounted && status !== "loading" && !!session;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C1E33] text-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-3">
            <Image
              src="/images/rof-logo.svg"
              alt="Rwanda Olympiad Foundation Logo"
              width={200}
              height={70}
              className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px]"
              priority
            />
            <span className="sr-only">ROLMS</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                  Dashboard
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                  Courses
                </Button>
              </Link>
              <Link href="/tests">
                <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                  Tests
                </Button>
              </Link>
              {session && (session.user?.role === "INSTRUCTOR" || session.user?.role === "ADMIN") && (
                <Link href="/instructor/dashboard">
                  <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                    Instructor
                  </Button>
                </Link>
              )}
              {session && session.user?.role === "ADMIN" && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                    Admin
                  </Button>
                </Link>
              )}
              {session && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback className="bg-[#0891B2] text-white">
                          {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {(session.user?.role === "INSTRUCTOR" || session.user?.role === "ADMIN") && (
                      <DropdownMenuItem asChild>
                        <Link href="/instructor/dashboard" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Instructor Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {session.user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </>
          ) : (
            <>
              <Link href="/courses">
                <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                  Courses
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-white hover:text-[#FBBF24]">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#0891B2] hover:bg-[#0891B2]/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <div className="pt-2 space-y-2">
              {isAuthenticated && session ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/courses" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                      Courses
                    </Button>
                  </Link>
                  {session && (session.user?.role === "INSTRUCTOR" || session.user?.role === "ADMIN") && (
                    <Link href="/instructor/dashboard" className="block">
                      <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                        Instructor
                      </Button>
                    </Link>
                  )}
                  {session && session.user?.role === "ADMIN" && (
                    <Link href="/admin/dashboard" className="block">
                      <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    className="w-full bg-[#0891B2] hover:bg-[#0891B2]/90 text-white"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/courses" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                      Courses
                    </Button>
                  </Link>
                  <Link href="/tests" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                      Tests
                    </Button>
                  </Link>
                  <Link href="/auth/signin" className="block">
                    <Button variant="ghost" className="w-full text-white hover:bg-[#0891B2]/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button className="w-full bg-[#0891B2] hover:bg-[#0891B2]/90 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
