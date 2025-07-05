"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EditItemDialog from "./edit-item-dialog";

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

interface ItemCardProps {
  item: ItemType;
  updateItem: (itemId: string, formData: FormData) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  markItemAsObtained: (itemId: string, obtained: boolean) => Promise<void>;
  priceInMonths?: number;
  cumulativePrice?: number;
  cumulativeTimeInMonths?: number;
  isPlanned?: boolean;
  currentBalance?: number;
  sparing?: number;
}

export default function ItemCard({ 
  item, 
  updateItem, 
  deleteItem, 
  markItemAsObtained,
  priceInMonths, 
  cumulativePrice, 
  cumulativeTimeInMonths, 
  isPlanned = false,
  currentBalance = 0,
  sparing = 0
}: ItemCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenUrl = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const handleMarkAsObtained = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    markItemAsObtained(item.id, !item.obtained);
  };

  // Determine if the item is available (cumulative cost < total balance)
  const isAvailable = cumulativePrice !== undefined && cumulativePrice <= currentBalance;

  // Determine if the item will be available next month (cumulative price <= current balance + sparing)
  const isAvailableNextMonth = 
    !isAvailable && 
    cumulativePrice !== undefined && 
    cumulativePrice <= (currentBalance + sparing);

  return (
    <>
      <div 
        className={`flex items-center border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative
          ${isAvailable && isPlanned && !item.obtained ? 'bg-green-50 border-green-200' : 'bg-white'}
          ${item.obtained ? 'p-2' : 'p-4'}
        `}
        onClick={() => setEditDialogOpen(true)}
      >
        {/* Tag for items available next month */}
        {isAvailableNextMonth && isPlanned && !item.obtained && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
            Available next month
          </div>
        )}
        {/* Icon on the left */}
        <div className={`${item.obtained ? 'text-2xl' : 'text-3xl'} mr-4 min-w-12 flex items-center justify-center`}>
          {item.icon || "📦"}
        </div>

        {/* Content in the middle */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h3 className={`${item.obtained ? 'text-base' : 'text-lg'} font-medium`}>{item.title}</h3>

            <div className="flex items-center gap-2">
              {/* Check button to mark as obtained - only shown if item is already obtained or if it's available */}
              {(item.obtained || isAvailable) && (
                <Button
                  variant={item.obtained ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${item.obtained ? 'bg-green-500 hover:bg-green-600' : ''}`}
                  onClick={handleMarkAsObtained}
                >
                  {item.obtained ? '✓' : '☐'}
                </Button>
              )}

              {/* Price on the right */}
              <div className="font-semibold text-green-600">
                ${item.price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* URL button - only shown for non-obtained items */}
          {item.url && !item.obtained && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenUrl}
                className="text-sm"
              >
                Open Link
              </Button>
            </div>
          )}

          {/* Price calculations - only shown for planned items that are not obtained */}
          {isPlanned && !item.obtained && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-muted-foreground">
              {priceInMonths !== undefined && (
                <div>
                  <div className="font-medium">Price in months:</div>
                  <div>{priceInMonths.toFixed(1)} months</div>
                </div>
              )}

              {cumulativePrice !== undefined && (
                <div>
                  <div className="font-medium">Cumulative price:</div>
                  <div>${cumulativePrice.toFixed(2)}</div>
                </div>
              )}

              {cumulativeTimeInMonths !== undefined && (
                <div>
                  <div className="font-medium">Time to get:</div>
                  <div>{cumulativeTimeInMonths.toFixed(1)} months</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EditItemDialog 
        item={item}
        updateItem={updateItem}
        deleteItem={deleteItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
