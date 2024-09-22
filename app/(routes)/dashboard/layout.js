'use client'
import React, { useState, useEffect } from "react";
import DashBoardHeader from "./_components/DashBoardHeader";
import { db } from '/utils/dbConfig';
import { Budgets } from '/utils/schema';
import SideNav from "./_components/SideNav";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const { user } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Add state to control sidebar

  useEffect(() => {
    if (user) {
      checkUserBudget();
    }
  }, [user]);

  const checkUserBudget = async () => {
    const result = await db.select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

    if (result?.length === 0) {
      router.replace('/dashboard/budgets');
    }
  };

  return (
    <div onClick={() => sidebarOpen ? setSidebarOpen(false) : ""}>

      {/* Sidebar for Desktop */}
      <div className={`fixed w-64 bg-white z-50 md:w-64 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
        <SideNav />
      </div>

      {/* Main content area */}
      <div className="md:ml-64">
        <DashBoardHeader setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;

