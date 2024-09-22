"use client";
import React, { useEffect, useState } from "react";
import { db } from "/utils/dbConfig";
import { Button } from "/components/ui/button";
import { Budgets, Expenses } from "/utils/schema";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import EditBudget from '../_components/EditBudget'
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import {Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const Expense = ({ params }) => {
  const { user } = useUser();
  const [budgerInfo, setBudgerInfo] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const route = useRouter()

  useEffect(() => {
    if (user && params.id) {
      getBudgerInfo();
    }
  }, [user, params.id]);

  const getBudgerInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params.id))
      .groupBy(Budgets.id);

    setBudgerInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));

    setExpenseList(result);
    console.log(expenseList);
  };

  const deleteBudget = async() => {
    const deleteExpenseResult = await db.delete(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    .returning(); 
    
    if(deleteExpenseResult){
    const result = await db.delete(Budgets)
    .where(eq(Budgets.id, params.id))
    .returning()
    }

    toast('Budget Deleted')
    route.replace('/dashboard/budgets')


  }

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        My Expenses
        <div className="flex gap-3 items-center">
        <EditBudget budgerInfo={budgerInfo} refreshData={() => getBudgerInfo()} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex gap-2 ">
              {" "}
              <Trash /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                current budget along with your expenses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()} >Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgerInfo ? (
          <BudgetItem budget={budgerInfo} />
        ) : (
          <div className="w-full bg-slate-200 rounded-lg  h-[150px] animate-pulse"></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgerInfo()}
        />
      </div>
      <div>
        
        <ExpenseListTable
          expensesList={expenseList}
          refreshData={() => getBudgerInfo()}
        />
      </div>
    </div>
  );
};

export default Expense;
