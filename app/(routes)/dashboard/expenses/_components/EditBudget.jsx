'use client'
import React, { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
  } from "/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { db } from "/utils/dbConfig";
import { Budgets } from "/utils/schema";
import { toast } from "sonner";
import { Input } from "/components/ui/input";
import { eq } from "drizzle-orm";

const EditBudget = ({budgerInfo, refreshData }) => {
    const [emojiIcon, setEmojiIcon] = useState(budgerInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const { user } = useUser();

  useEffect(() => {
    if(budgerInfo){
        setEmojiIcon(budgerInfo?.icon)
        setName(budgerInfo?.name)
        setAmount(budgerInfo?.amount)
    }
    
  }, [budgerInfo])


  const onUpdateBudget = async () => {
    const result = await db.update(Budgets).set({
        name:name,
        amount: amount,
        icon: emojiIcon
    }).where(eq(Budgets.id, budgerInfo.id))
    .returning();

    if(result){
        refreshData()
        toast("Budget Update")
    }
  }


  return (
    <div>
        <Dialog>
        <DialogTrigger asChild>
        <Button className="flex gap-2"><Edit /> Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Exisiting Budget</DialogTitle>
            <DialogDescription>
              <div>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute mt-4 z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g Home Decor"
                    defaultValue={budgerInfo?.name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    placeholder="e.g $5000"
                    defaultValue={budgerInfo?.amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                  />
                </div>
                
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
          <Button
                  
                  onClick={() => onUpdateBudget()}
                  className="mt-5 w-full"
                >
                  Update Budget
                </Button>
          </DialogClose>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditBudget