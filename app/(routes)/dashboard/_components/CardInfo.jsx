"use client"
import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const CardInfo = ({budgetList}) => {

    const [totalBudget, setTotalBudget] = useState(0)
    const [totalSpend, setTotalSpend] = useState(0)


    useEffect(() => {
        CalculateCardInfo();
    }, [budgetList])
    const CalculateCardInfo = () => {
        let totalBudget_ = 0;
        let totalSpend_ = 0
        budgetList?.forEach(element => {
            totalBudget_ = totalBudget_ + Number(element.amount)
            totalSpend_ = totalSpend_+ element.totalSpend

        })
        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_)

    }
  return (
    <div>
        {budgetList?.length > 0 ? <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='p-7 border  rounded-lg flex items-center justify-between'>
        <div>
            <h2 className='text-sm'>Total Budget</h2>
            <h2 className='font-bold text-2xl'>${totalBudget}</h2>
        </div>
        <PiggyBank
        className='bg-primary text-white p-3 w-12 h-12 rounded-full'
         />
        </div>
        <div className='p-7 border  rounded-lg flex items-center justify-between'>
        <div>
            <h2 className='text-sm'>Total Spend</h2>
            <h2 className='font-bold text-2xl'>${totalSpend}</h2>
        </div>
        <ReceiptText
        className='bg-primary text-white p-3 w-12 h-12 rounded-full'
         />
        </div>
        <div className='p-7 border  rounded-lg flex items-center justify-between'>
        <div>
            <h2 className='text-sm'>No. of Budget</h2>
            <h2 className='font-bold text-2xl'>{budgetList.length}</h2>
        </div>
        <Wallet
        className='bg-primary text-white p-3 w-12 h-12 rounded-full'
         />
        </div>
    </div> : 
    <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
            [1,2,3].map((item, index) => (
            <div className='h-[160px] rounded-lg animate-pulse w-full bg-slate-200' key={index}></div>
            ))
        }
    </div>
    }
    </div>
  )
}

export default CardInfo