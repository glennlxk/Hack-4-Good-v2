"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import SignInButton from "@/components/auth/signInButton";
import { useSession } from "next-auth/react";
import UserProfile from "../auth/userProfile";
import { SearchBar } from "./searchBar";
import MessageLogo from "./messageLogo";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { status, data } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="shadow-md w-full relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[3.5rem] md:h-[4.5rem]">
          <div className="flex items-center justify-start space-x-6 grow">
            <Link href={"/"}>
              <div className="tracking-wider font-bold text-2xl text-main-600 flex-shrink-0">
                {/* Logo Place Holder */}
                Musixtica
              </div>
            </Link>
            <div className="hidden md:flex grow">
              <SearchBar />
            </div>
          </div>
          <div className="hidden md:flex items-center justify-start space-x-6">
            <div>
              <Link href={"/tasks"}>tasks</Link>
            </div>
            <div>
              <Link href={"/listing"}>Marketplace</Link>
            </div>
            {status == "unauthenticated" && <SignInButton />}
            {/* Can have is admin if you want */}
            {/* Not implemented {status == "authenticated" && <MessageLogo />} */}
            {status == "authenticated" && <UserProfile />}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`absolute top-14 left-0 right-0 bg-white md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100 shadow-lg" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-2 px-4 py-3">
          <SearchBar />
          <div className="pt-3">
            <Link href={"/about"}>About</Link>
          </div>
          <div className="pb-3">
            <Link href={"/listing"}>Marketplace</Link>
          </div>
          <SignInButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
