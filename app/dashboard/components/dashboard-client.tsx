"use client"

import { useUser } from "@/context/UserContext";
import CreateItemDialog from "./create-item-dialog";
import ItemCard from "./item-card";

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
    items: ItemType[];
    createItem: (userId: string, formData: FormData) => Promise<void>;
}

export default function DashboardClient({ items, createItem }: DashboardClientProps) {
    const user = useUser();

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Here is the main app
                </h2>
                <div className="grid gap-4 mt-4">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
            <div>
                <CreateItemDialog createItem={createItem} />
            </div>
        </div>
    );
}
