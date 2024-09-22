"use client";

import React, { useState, useEffect } from "react";
import CardInfo from "./_components/CardInfo";
import BarChartDash from './_components/BarChartDash'
import { db } from "/utils/dbConfig";
import { Budgets, Expenses } from "/utils/schema";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";

const page = () => {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([])

  useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user]);

  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

        setBudgetList(result);
        getAllExpenses()
  };

  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt
    }).from(Budgets)
    .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
    .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
    .orderBy(desc(Expenses.id))

    setExpensesList(result)
  }
  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl">Hi, {user?.fullName} 🤞</h2>
      <p className="text-gray-500">
        Here's what happening with your money, Let's Manage your expense
      </p>

      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDash budgetList={budgetList}/>
          <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetInfo()} />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budget</h2>
          {budgetList.map((budget, index) =>(
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
