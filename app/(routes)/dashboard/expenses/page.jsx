"use client";

import React, { useState, useEffect } from "react";
import { db } from "/utils/dbConfig";
import { Budgets, Expenses } from "/utils/schema";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import ExpenseListTable from "./_components/ExpenseListTable";

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
        <h2 className="font-bold text-3xl">My Expenses</h2>
        <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetInfo()} />
    </div>
  )
}

export default page