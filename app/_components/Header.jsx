"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Image src="/logo.svg" width={50} height={50} alt="logo" />
      {
      isSignedIn ? 
      <div className="flex items-center gap-4">
        <Link href='/dashboard'><Button variant="outline">Dashboard</Button></Link>
        <UserButton />
      </div> 
      : 
      <Link href='/sign-in'><Button>Get Started</Button></Link>
      }
    </div>
  ); 
};

export default Header;
