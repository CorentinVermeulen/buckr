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

async function markItemAsObtained(itemId: string, obtained: boolean) {
    'use server'
    // Get the item to know its price and userId
    const item = await prisma.item.findUnique({
        where: {
            id: itemId
        }
    });

    if (!item) {
        throw new Error("Item not found");
    }

    // Update the item's obtained status
    await prisma.item.update({
        where: {
            id: itemId
        },
        data: {
            obtained: obtained
        }
    });

    // Get the budget to know the current balance
    const budget = await prisma.budget.findUnique({
        where: {
            userId: item.userId
        }
    });

    if (budget) {
        // Calculate the new balance
        // If the item is being marked as obtained, subtract its price
        // If the item is being marked as not obtained, add its price back
        const newBalance = obtained 
            ? Math.max(0, budget.currentBalance - item.price) 
            : budget.currentBalance + item.price;

        // Update the budget's current balance
        await prisma.budget.update({
            where: {
                userId: item.userId
            },
            data: {
                currentBalance: newBalance
            }
        });
    }

    revalidatePath('/dashboard');
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

async function moveItemUp(itemId: string) {
    'use server'
    // Get the current item
    const currentItem = await prisma.item.findUnique({
        where: { id: itemId }
    });

    if (!currentItem || currentItem.order === null) {
        return; // Not a planned item or doesn't exist
    }

    // Find the item that comes before this one (with the next lower order value)
    const previousItem = await prisma.item.findFirst({
        where: {
            order: { lt: currentItem.order },
            obtained: false // Only consider non-obtained items for reordering
        },
        orderBy: {
            order: 'desc'
        }
    });

    if (!previousItem || previousItem.order === null) {
        return; // Already at the top
    }

    // Swap the order values
    await prisma.$transaction([
        prisma.item.update({
            where: { id: currentItem.id },
            data: { order: previousItem.order }
        }),
        prisma.item.update({
            where: { id: previousItem.id },
            data: { order: currentItem.order }
        })
    ]);

    revalidatePath('/dashboard');
}

async function moveItemDown(itemId: string) {
    'use server'
    // Get the current item
    const currentItem = await prisma.item.findUnique({
        where: { id: itemId }
    });

    if (!currentItem || currentItem.order === null) {
        return; // Not a planned item or doesn't exist
    }

    // Find the item that comes after this one (with the next higher order value)
    const nextItem = await prisma.item.findFirst({
        where: {
            order: { gt: currentItem.order },
            obtained: false // Only consider non-obtained items for reordering
        },
        orderBy: {
            order: 'asc'
        }
    });

    if (!nextItem || nextItem.order === null) {
        return; // Already at the bottom
    }

    // Swap the order values
    await prisma.$transaction([
        prisma.item.update({
            where: { id: currentItem.id },
            data: { order: nextItem.order }
        }),
        prisma.item.update({
            where: { id: nextItem.id },
            data: { order: currentItem.order }
        })
    ]);

    revalidatePath('/dashboard');
}

async function moveToPlanned(itemId: string) {
    'use server'
    // Get the current item
    const currentItem = await prisma.item.findUnique({
        where: { id: itemId }
    });

    if (!currentItem || currentItem.order !== null) {
        return; // Already a planned item or doesn't exist
    }

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
    const newOrder = maxOrderItem ? (maxOrderItem.order as number) + 1 : 1;

    // Update the item to be planned
    await prisma.item.update({
        where: { id: itemId },
        data: { order: newOrder }
    });

    revalidatePath('/dashboard');
}

async function moveToBacklog(itemId: string) {
    'use server'
    // Get the current item
    const currentItem = await prisma.item.findUnique({
        where: { id: itemId }
    });

    if (!currentItem || currentItem.order === null) {
        return; // Already a backlog item or doesn't exist
    }

    // Update the item to be in backlog
    await prisma.item.update({
        where: { id: itemId },
        data: { order: null }
    });

    revalidatePath('/dashboard');
}

export default async function DashboardPage() {
    const [plannedItems, backlogItems, budget] = await Promise.all([
        prisma.item.findMany({
            where: {
                order: {
                    not: null
                }
            },
            orderBy: [
                {
                    obtained: 'asc'
                },
                {
                    order: 'asc'
                }
            ]
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
        markItemAsObtained={markItemAsObtained}
        moveItemUp={moveItemUp}
        moveItemDown={moveItemDown}
        moveToPlanned={moveToPlanned}
        moveToBacklog={moveToBacklog}
    />
}
