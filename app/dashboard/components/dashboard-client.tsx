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
    moveItemUp: (itemId: string) => Promise<void>;
    moveItemDown: (itemId: string) => Promise<void>;
    moveToPlanned: (itemId: string) => Promise<void>;
    moveToBacklog: (itemId: string) => Promise<void>;
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
    markItemAsObtained,
    moveItemUp,
    moveItemDown,
    moveToPlanned,
    moveToBacklog
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
    // Also track the index of non-obtained items (1-based)
    let nonObtainedIndex = 0;
    const plannedItemsWithCalculations = plannedItems.map((item, index, array) => {
        // Increment the non-obtained index counter for non-obtained items
        if (!item.obtained) {
            nonObtainedIndex++;
        }

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
        const remainingTimeInMonths = remainingCost / sparingValue;

        // Check if this is the last non-obtained item
        const isLast = !item.obtained && index === lastNonObtainedIndex;

        return {
            item,
            priceInMonths,
            cumulativePrice,
            remainingCost,
            remainingTimeInMonths,
            isLast,
            itemIndex: !item.obtained ? nonObtainedIndex : null
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
                            Buy Queue
                        </h2>
                        <CreateItemDialog createItem={createItem} isPlanned={true} />
                    </div>

                    <div className="grid gap-3 sm:gap-4 mt-3 sm:mt-4">
                        {plannedItemsWithCalculations.length > 0 ? (
                            plannedItemsWithCalculations.map(({ item, priceInMonths, cumulativePrice, remainingCost, remainingTimeInMonths , isLast, itemIndex }) => (
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
                                        remainingCost = {remainingCost}
                                        remainingTimeInMonths={remainingTimeInMonths}
                                        isPlanned={true}
                                        currentBalance={currentBalanceValue}
                                        sparing={sparingValue}
                                        isLast={isLast}
                                        moveItemUp={moveItemUp}
                                        moveItemDown={moveItemDown}
                                        moveToBacklog={moveToBacklog}
                                        itemIndex={itemIndex}
                                    />
                                )
                            ))
                        ) : (
                            <div className="border border-dashed rounded-lg p-4 text-muted-foreground flex flex-col items-center">
                                <p className="mb-2 text-center">
                                    The <strong>Buy Queue</strong> allows you to plan your purchases based on your monthly saving budget.
                                </p>
                                <p className="mb-2 text-center">
                                    Items are displayed with time estimates showing when you&#39;ll be able to buy them.
                                </p>
                                <p className="mt-2 mb-2 text-center">
                                    The order of items impacts these estimates - you can reorder them by <strong>right-clicking</strong> and selecting <strong>&ldquo;Move Up&rdquo;</strong>  or <strong>&ldquo;Move Down&rdquo;</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Wishlist
                        </h2>
                        <CreateItemDialog createItem={createItem} isPlanned={false} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 w-full">
                        {backlogItems.length > 0 ? (
                            backlogItems.map(item => (
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
                                        moveToPlanned={moveToPlanned}
                                    />
                                )
                            ))
                        ) : (
                            <div className="border border-dashed rounded-lg p-4 text-muted-foreground flex flex-col items-center col-span-1 sm:col-span-2">
                                <p className="mb-2 text-center">
                                    The <strong>Wishlist</strong> lets you keep track of items that you don&#39;t know when to buy yet.
                                </p>
                                <p className="mb-2 text-center">
                                    When you&#39;re ready to plan a purchase, you can move items to the Buy Queue by <strong>right-clicking</strong> and selecting <strong>&ldquo;Move to Planned&rdquo;</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
