"use client"

import { useUser } from "@/context/UserContext";
import CreateItemDialog from "./create-item-dialog";
import ItemCard from "./item-card";
import ObtainedItemCard from "./obtained-item-card";
import BacklogItemCard from "./backlog-item-card";
import DashboardSidebar from "./dashboard-sidebar";

type ItemType = {
    id: string;
    userId: string;
    icon: string;
    title: string;
    price: number;
    url: string | null;
    order: number | null;
    obtained: boolean;
}

type BudgetType = {
    id: string;
    userId: string;
    sparing: number;
    currentBalance: number;
    lastIncrement: Date;
} | null;

interface DashboardClientProps {
    plannedItems: ItemType[];
    backlogItems: ItemType[];
    budget: BudgetType;
    createItem: (userId: string, formData: FormData) => Promise<void>;
    updateItem: (itemId: string, formData: FormData) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
    updateCurrentBalance: (userId: string, newBalance: number) => Promise<void>;
    spareNow: (userId: string, sparingAmount: number) => Promise<void>;
    updateSparing: (userId: string, sparingAmount: number) => Promise<void>;
    markItemAsObtained: (itemId: string, obtained: boolean) => Promise<void>;
}

export default function DashboardClient({ 
    plannedItems, 
    backlogItems, 
    budget, 
    createItem, 
    updateItem, 
    deleteItem,
    updateCurrentBalance,
    spareNow,
    updateSparing,
    markItemAsObtained
}: DashboardClientProps) {
    const user = useUser();

    if (!user) {
        return <div>Loading user data...</div>;
    }

    // Default values for budget properties
    const sparingValue = budget?.sparing || 10;
    const currentBalanceValue = budget?.currentBalance || 0;

    // Calculate the already spent amount (sum of prices of all obtained items)
    const alreadySpentAmount = [...plannedItems, ...backlogItems]
        .filter(item => item.obtained)
        .reduce((total, item) => total + item.price, 0);

    // Calculate the total price of all planned items that are not obtained
    const totalPlannedPrice = plannedItems
        .filter(item => !item.obtained)
        .reduce((total, item) => total + item.price, 0);

    // Calculate the missing amount (total planned price - current balance)
    const missingAmount = Math.max(0, totalPlannedPrice - currentBalanceValue);

    // Calculate the time to finish (missing amount / sparing)
    const timeToFinish = sparingValue > 0 ? missingAmount / sparingValue : 0;

    // Find the index of the last non-obtained item
    const lastNonObtainedIndex = plannedItems.map(item => !item.obtained).lastIndexOf(true);

    // Calculate price in months, cumulative price, and cumulative time for each planned item
    const plannedItemsWithCalculations = plannedItems.map((item, index, array) => {
        // Price equivalence in months: price / sparing
        const priceInMonths = item.price / sparingValue;

        // Calculate cumulative price (sum of prices of all non-obtained items up to and including this one)
        let cumulativePrice = 0;
        for (let i = 0; i <= index; i++) {
            if (!array[i].obtained) {
                cumulativePrice += array[i].price;
            }
        }

        // Calculate cumulative time in months: (cumulative price - current balance) / sparing
        // If current balance covers the cumulative price, time is 0
        const remainingCost = Math.max(0, cumulativePrice - currentBalanceValue);
        const cumulativeTimeInMonths = remainingCost / sparingValue;

        // Check if this is the last non-obtained item
        const isLast = !item.obtained && index === lastNonObtainedIndex;

        return {
            item,
            priceInMonths,
            cumulativePrice,
            cumulativeTimeInMonths,
            isLast
        };
    });

    return (
        <div className="flex flex-col md:flex-row w-full">
            {/* Sidebar - full width on mobile, left side on desktop */}
            <DashboardSidebar 
                budget={budget}
                userId={user.id}
                updateCurrentBalance={updateCurrentBalance}
                spareNow={spareNow}
                updateSparing={updateSparing}
                alreadySpentAmount={alreadySpentAmount}
                missingAmount={missingAmount}
                timeToFinish={timeToFinish}
            />

            {/* Main content - below sidebar on mobile, right side on desktop */}
            <div className="flex-1 flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Futurs Achats
                        </h2>
                        <CreateItemDialog createItem={createItem} isPlanned={true} />
                    </div>

                    <div className="grid gap-3 sm:gap-4 mt-3 sm:mt-4">
                        {plannedItemsWithCalculations.map(({ item, priceInMonths, cumulativePrice, cumulativeTimeInMonths, isLast }) => (
                            item.obtained ? (
                                <ObtainedItemCard
                                    key={item.id} 
                                    item={item} 
                                    updateItem={updateItem} 
                                    deleteItem={deleteItem}
                                    markItemAsObtained={markItemAsObtained}
                                />
                            ) : (
                                <ItemCard 
                                    key={item.id} 
                                    item={item} 
                                    updateItem={updateItem} 
                                    deleteItem={deleteItem}
                                    markItemAsObtained={markItemAsObtained}
                                    priceInMonths={priceInMonths}
                                    cumulativePrice={cumulativePrice}
                                    cumulativeTimeInMonths={cumulativeTimeInMonths}
                                    isPlanned={true}
                                    currentBalance={currentBalanceValue}
                                    sparing={sparingValue}
                                    isLast={isLast}
                                />
                            )
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Boite à Idée
                        </h2>
                        <CreateItemDialog createItem={createItem} isPlanned={false} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 w-full">
                        {backlogItems.map(item => (
                            item.obtained ? (
                                <ObtainedItemCard 
                                    key={item.id} 
                                    item={item} 
                                    updateItem={updateItem} 
                                    deleteItem={deleteItem} 
                                    markItemAsObtained={markItemAsObtained}
                                />
                            ) : (
                                <BacklogItemCard 
                                    key={item.id} 
                                    item={item} 
                                    updateItem={updateItem} 
                                    deleteItem={deleteItem} 
                                    markItemAsObtained={markItemAsObtained}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
