import { UserButton } from "@clerk/nextjs";
import { LayoutDashboardIcon, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideNav = () => {
  const menuList = [
    { id: 0, name: "Dashboard", icon: LayoutDashboardIcon, path: '/dashboard' },
    { id: 1, name: "Budgets", icon: PiggyBank, path: '/dashboard/budgets' },
    { id: 2, name: "Expense", icon: ReceiptText, path: '/dashboard/expenses' },
    { id: 3, name: "Upgrade", icon: ShieldCheck, path: '/dashboard/upgrade' },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-5 border shadow-sm bg-white">
      <Image src={"/logo.svg"} alt="logo" width={60} height={60} />
      <div className="mt-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={`flex items-center gap-4 text-gray-500 font-medium cursor-pointer rounded-md mb-2 p-3 md:p-5 hover:text-primary hover:bg-blue-200 ${path == menu.path && 'text-primary bg-blue-200'}`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 flex gap-2 items-center text-gray-500 font-medium">
        <UserButton />
        <h2>Profile</h2>
      </div>
    </div>
  );
};

export default SideNav;
