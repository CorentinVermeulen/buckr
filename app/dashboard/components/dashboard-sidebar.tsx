"use client"

import {useState, useEffect} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";

type BudgetType = {
    id: string;
    userId: string;
    sparing: number;
    currentBalance: number;
    lastIncrement: Date;
} | null;

interface DashboardSidebarProps {
    budget: BudgetType;
    userId: string;
    updateCurrentBalance: (userId: string, newBalance: number) => Promise<void>;
    spareNow: (userId: string, sparingAmount: number) => Promise<void>;
    updateSparing: (userId: string, sparingAmount: number) => Promise<void>;
    alreadySpentAmount: number;
    missingAmount: number;
    timeToFinish: number;
}

export default function DashboardSidebar({
                                             budget,
                                             userId,
                                             updateCurrentBalance,
                                             spareNow,
                                             updateSparing,
                                             alreadySpentAmount,
                                             missingAmount,
                                             timeToFinish
                                         }: DashboardSidebarProps) {
    const [currentBalanceDialogOpen, setCurrentBalanceDialogOpen] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(budget?.currentBalance || 0);
    const [sparingValue, setSparingValue] = useState(budget?.sparing || 10);
    const [daysSinceLastIncrement, setDaysSinceLastIncrement] = useState<number | null>(null);

    // Calculate days since last increment
    useEffect(() => {
        if (budget?.lastIncrement) {
            const lastIncrementDate = new Date(budget.lastIncrement);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - lastIncrementDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            setDaysSinceLastIncrement(diffDays);
        } else {
            setDaysSinceLastIncrement(null);
        }
    }, [budget]);

    const handleCurrentBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentBalance(parseFloat(e.target.value) || 0);
    };

    const handleCurrentBalanceIncrement = () => {
        setCurrentBalance(prev => prev + 10);
    };

    const handleCurrentBalanceDecrement = () => {
        setCurrentBalance(prev => Math.max(0, prev - 10));
    };

    const handleCurrentBalanceDialogClose = () => {
        updateCurrentBalance(userId, currentBalance);
        setCurrentBalanceDialogOpen(false);
    };

    const handleSpareNow = () => {
        spareNow(userId, sparingValue);
    };


    return (
        <div className="w-80 flex-shrink-0 border-r bg-muted/10 p-6 space-y-6 h-full overflow-y-auto">
            <Card className="overflow-hidden">
                <CardContent className="px-4 py-2 space-y-4">
                    <div className="text-sm font-medium flex flex-row justify-between gap-2 items-center">
                        <div>
                            Budget per month
                        </div>
                        <div className="text-2xl font-bold text-center">
                            ${sparingValue}
                        </div>
                    </div>

                    <Slider
                        value={[sparingValue]}
                        min={10}
                        max={1000}
                        step={10}
                        onValueChange={(value) => {
                            setSparingValue(value[0]);
                            updateSparing(userId, value[0]);
                        }}
                    />
                    <Button onClick={handleSpareNow} className="w-full">
                        Spare Now
                    </Button>
                    {daysSinceLastIncrement !== null && (
                        <div className="mt-2 text-sm text-muted-foreground text-center">
                            Last increment: {daysSinceLastIncrement} {daysSinceLastIncrement === 1 ? 'day' : 'days'} ago
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentBalanceDialogOpen(true)}
            >
                <CardContent className="px-4 py-2 space-y-4">
                    <div className="text-sm font-medium flex flex-row justify-between gap-2 items-center">
                        <div>
                            Current Balance
                        </div>
                        <div className="text-xl font-bold text-center">
                            ${budget?.currentBalance.toFixed(2) || "0.00"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={currentBalanceDialogOpen} onOpenChange={handleCurrentBalanceDialogClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Current Balance</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-6 py-4">
                        <div className="text-4xl font-bold">
                            ${currentBalance.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleCurrentBalanceDecrement}
                                className="h-16 w-16 text-3xl"
                            >
                                -
                            </Button>
                            <Input
                                type="number"
                                value={currentBalance}
                                onChange={handleCurrentBalanceChange}
                                className="text-center text-xl h-16"
                            />
                            <Button
                                onClick={handleCurrentBalanceIncrement}
                                className="h-16 w-16 text-3xl"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Card className="overflow-hidden">
                <CardContent className="px-4 py-2 space-y-4">
                    <div className="text-sm font-medium flex flex-row justify-between gap-2 items-center">
                        <div>
                            Missing
                        </div>
                        <div className="text-xl font-bold text-center">
                            ${missingAmount.toFixed(2)}
                        </div>
                    </div>

                    <div className="text-sm font-medium flex flex-row justify-between gap-2 items-center">
                        <div>
                            Time to finish
                        </div>
                        <div className="text-xl font-bold text-center">
                            {timeToFinish.toFixed(1)} months
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardContent className="px-4 py-2 space-y-4">
                    <div className="text-sm font-medium flex flex-row justify-between gap-2 items-center">
                        <div>
                            Already Spent
                        </div>
                        <div className="text-xl font-bold text-center">
                            ${alreadySpentAmount.toFixed(2)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
