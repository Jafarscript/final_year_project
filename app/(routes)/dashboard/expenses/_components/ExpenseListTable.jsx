import { Trash } from 'lucide-react'
import React from 'react'
import { db } from "/utils/dbConfig";
import { eq } from 'drizzle-orm';
import { Expenses } from "/utils/schema";
import { toast } from 'sonner';

const ExpenseListTable = ({expensesList, refreshData}) => {
    // console.log(expenseList)
    const deleteExpense=async(expenses) => {
        const result = await db.delete(Expenses)
        .where(eq(Expenses.id, expenses.id))
        .returning();

        if(result){
            refreshData()
            toast("Expense deleted successfully")
        }
    }
  return (
    <div className='mt-3'>
      <h2 className="text-2xl font-bold">Lastest Expenses</h2>
        <table className='p-2 w-full'>
      <thead>
        <tr className='bg-slate-200'>
          <th className='font-bold'>Name</th>
          <th className='font-bold'>Amount</th>
          <th className='font-bold'>Date</th>
          <th className='font-bold'>Action</th>
        </tr>
      </thead>
      <tbody>
        {expensesList?.map((expense, index) => (
          <tr className='bg-slate-50 p-3 text-center' key={index}>
            <td>{expense.name}</td>
            <td>{expense.amount}</td>
            <td>{expense.createdAt}</td>
            <td className='flex justify-center items-center'>
              <Trash
                className='text-red-600 cursor-pointer'
                onClick={() => deleteExpense(expense)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table> 
    </div>
  )
}

export default ExpenseListTable