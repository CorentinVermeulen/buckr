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
    const isPlanned = formData.get('isPlanned') === 'true';

    let orderValue = null;
    if (isPlanned) {
        // Find the maximum order value of planned items
        const maxOrderItem = await prisma.item.findFirst({
            where: {
                order: {
                    not: null
                }
            },
            orderBy: {
                order: 'desc'
            }
        });

        // Set the new order value to max + 1, or 1 if no planned items exist
        orderValue = maxOrderItem ? (maxOrderItem.order as number) + 1 : 1;
    }

    await prisma.item.create({
        data: {
            title: formData.get('title') as string,
            url: formData.get('url') as string,
            price: parseFloat(formData.get('price') as string),
            icon: formData.get('icon') as string,
            userId: userId,
            order: orderValue,
        }
    })
    revalidatePath('/dashboard')
}

async function updateItem(itemId: string, formData: FormData) {
    'use server'
    await prisma.item.update({
        where: {
            id: itemId
        },
        data: {
            title: formData.get('title') as string,
            url: formData.get('url') as string,
            price: parseFloat(formData.get('price') as string),
            icon: formData.get('icon') as string,
        }
    })
    revalidatePath('/dashboard')
}

export default async function DashboardPage() {
    const [plannedItems, backlogItems]: [ItemType[], ItemType[]] = await Promise.all([
        prisma.item.findMany({
            where: {
                order: {
                    not: null
                }
            },
            orderBy: {
                order: 'asc'
            }
        }),
        prisma.item.findMany({
            where: {
                order: null
            }
        })
    ]);

    return <DashboardClient plannedItems={plannedItems} backlogItems={backlogItems} createItem={createItem}
                            updateItem={updateItem}/>
}
