import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import DashboardClient from "./components/dashboard-client";

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

async function createItem(userId: string, formData: FormData) {
    'use server'
    await prisma.item.create({
        data: {
            title: formData.get('title') as string,
            url: formData.get('url') as string,
            price: parseFloat(formData.get('price') as string),
            icon: formData.get('icon') as string,
            userId: userId,
        }
    })
    revalidatePath('/dashboard')
}

export default async function DashboardPage() {
    // Fetch items on the server
    const items: ItemType[] = await prisma.item.findMany()

    return <DashboardClient items={items} createItem={createItem} />
}
