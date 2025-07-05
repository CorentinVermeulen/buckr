import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import DashboardClient from "./components/dashboard-client";

type BudgetType = {
    id: string;
    userId: string;
    sparing: number;
    currentBalance: number;
    lastIncrement: Date;
};

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

async function deleteItem(itemId: string) {
    'use server'
    await prisma.item.delete({
        where: {
            id: itemId
        }
    })
    revalidatePath('/dashboard')
}

async function updateCurrentBalance(userId: string, newBalance: number) {
    'use server'
    await prisma.budget.upsert({
        where: {
            userId: userId
        },
        update: {
            currentBalance: newBalance,
            lastIncrement: new Date()
        },
        create: {
            userId: userId,
            currentBalance: newBalance,
            sparing: 10,
            lastIncrement: new Date()
        }
    })
    revalidatePath('/dashboard')
}

async function spareNow(userId: string, sparingAmount: number) {
    'use server'
    const budget = await prisma.budget.findUnique({
        where: {
            userId: userId
        }
    })

    if (budget) {
        await prisma.budget.update({
            where: {
                userId: userId
            },
            data: {
                currentBalance: budget.currentBalance + sparingAmount,
                lastIncrement: new Date()
            }
        })
    } else {
        await prisma.budget.create({
            data: {
                userId: userId,
                currentBalance: sparingAmount,
                sparing: sparingAmount,
                lastIncrement: new Date()
            }
        })
    }

    revalidatePath('/dashboard')
}

async function updateSparing(userId: string, sparingAmount: number) {
    'use server'
    await prisma.budget.upsert({
        where: {
            userId: userId
        },
        update: {
            sparing: sparingAmount
        },
        create: {
            userId: userId,
            currentBalance: 0,
            sparing: sparingAmount,
            lastIncrement: new Date()
        }
    })
    revalidatePath('/dashboard')
}

export default async function DashboardPage() {
    const [plannedItems, backlogItems, budget] = await Promise.all([
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
        }),
        prisma.budget.findFirst() // Assuming there's only one budget for now
    ]);

    return <DashboardClient 
        plannedItems={plannedItems} 
        backlogItems={backlogItems} 
        budget={budget}
        createItem={createItem}
        updateItem={updateItem} 
        deleteItem={deleteItem}
        updateCurrentBalance={updateCurrentBalance}
        spareNow={spareNow}
        updateSparing={updateSparing}
    />
}
