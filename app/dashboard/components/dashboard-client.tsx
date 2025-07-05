"use client"

import { useUser } from "@/context/UserContext";
import CreateItemDialog from "./create-item-dialog";
import ItemCard from "./item-card";
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

interface DashboardClientProps {
    plannedItems: ItemType[];
    backlogItems: ItemType[];
    createItem: (userId: string, formData: FormData) => Promise<void>;
    updateItem: (itemId: string, formData: FormData) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
}

export default function DashboardClient({ plannedItems, backlogItems , createItem, updateItem, deleteItem }: DashboardClientProps) {
    const user = useUser();

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="flex w-full">
            {/* Sidebar on the left */}
            <DashboardSidebar />

            {/* Main content on the right */}
            <div className="flex-1 flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Futurs Achats
                        </h2>
                        <CreateItemDialog createItem={createItem} isPlanned={true} />
                    </div>

                    <div className="grid gap-4 mt-4">
                        {plannedItems.map(item => (
                            <ItemCard key={item.id} item={item} updateItem={updateItem} deleteItem={deleteItem} />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Boite à Idée
                        </h2>
                        <CreateItemDialog createItem={createItem} isPlanned={false} />
                    </div>

                    <div className="grid gap-4 mt-4">
                        {backlogItems.map(item => (
                            <ItemCard key={item.id} item={item} updateItem={updateItem} deleteItem={deleteItem} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
