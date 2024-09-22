"use client";
import React, { useState } from "react";
import { Input } from "/components/ui/input";
import { Button } from "/components/ui/button";
import { db } from "/utils/dbConfig";
import { Budgets, Expenses } from "/utils/schema";
import { toast } from "sonner";
import moment from "moment";
import { Loader } from "lucide-react";

const AddExpense = ({ budgetId, user, refreshData }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/YYYY"),
      })
      .returning({ insertId: Budgets.id });

    setAmount("");
    setName("");

    if (result) {
      setLoading(false);
      refreshData();
      toast("New Expense Add");
    }
    setLoading(false);
  };
  return (
    <div className="rounded-lg p-5 border">
      <h2 className="text-2xl font-bold">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g Home Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g $5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
