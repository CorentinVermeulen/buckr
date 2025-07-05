"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, HandCoins } from "lucide-react";
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
  isLast?: boolean;
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
  sparing = 0,
  isLast = false
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
    markItemAsObtained(item.id, true);
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
        <div className="flex flew-row justify-between relative mb-3 sm:mb-4">
          {/* Timeline column - hidden on small mobile, visible on larger screens */}
          <div className="hidden sm:flex w-1/5 flex-col items-center justify-center">
            {isPlanned && (
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end gap-1">
                      {cumulativeTimeInMonths !== undefined && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {cumulativeTimeInMonths.toFixed(1)} mo
                          </Badge>
                      )}
                      {cumulativePrice !== undefined && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            ${cumulativePrice.toFixed(2)}
                          </Badge>
                      )}
                    </div>

                    <div className="relative">
                      {!isLast && (
                        <div className="absolute w-0.5 h-16 bg-gray-200 top-12 left-1/2 transform -translate-x-1/2"/>
                      )}
                      <div className="rounded-full bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <span className="font-medium text-sm sm:text-base">{priceInMonths?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Main card content - full width on mobile, 4/5 width on larger screens */}
          <div
              className={`w-full sm:w-4/5 flex border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4
              ${isAvailable ? 'border-green-500' : 'border-gray-200'}
              ${!isAvailable ? 'bg-white' : ''}`}
              onClick={() => setEditDialogOpen(true)}
          >
            {/* Left part: Icon centered */}
            <div className="flex items-center justify-center w-auto px-2 sm:px-3">
              <div className="text-2xl sm:text-3xl">
                {item.icon || "📦"}
              </div>
            </div>

            {/* Center part: Title, URL button, and badges */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {/* Title */}
                <h3 className="text-base sm:text-lg font-medium">{item.title}</h3>

                {/* URL button */}
                {item.url && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenUrl}
                        className="p-1 h-auto"
                    >
                      <Link className="h-3 w-3 sm:h-4 sm:w-4"/>
                    </Button>
                )}
              </div>

              {/* Mobile-only timeline info */}
              {isPlanned && (
                <div className="flex sm:hidden flex-wrap gap-1 mt-1">
                  {cumulativeTimeInMonths !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      {cumulativeTimeInMonths.toFixed(1)} mo
                    </Badge>
                  )}
                  {cumulativePrice !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      ${cumulativePrice.toFixed(2)}
                    </Badge>
                  )}
                </div>
              )}

              {/* Price calculations as badges - only shown for planned items */}
              {isPlanned && (
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                    {priceInMonths !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          {priceInMonths.toFixed(1)} months
                        </Badge>
                    )}
                  </div>
              )}
            </div>

            {/* Right part: Next month badge, price, and checkbox */}
            <div className="flex flex-col items-end justify-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[100px]">
              {/* Price */}
              <div className={`font-semibold text-sm sm:text-base ${isAvailable ? 'text-green-600' : ''}`}>
                ${item.price.toFixed(2)}
              </div>

              {isAvailableNextMonth && isPlanned && (
                  <Badge className="bg-purple-600 text-white font-semibold text-xs">
                    Next month
                  </Badge>
              )}

              {/* Check button to mark as obtained - only shown if it's available */}
              {isAvailable && (
                  <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0"
                      onClick={handleMarkAsObtained}
                  >
                    <HandCoins className="h-3 w-3 sm:h-4 sm:w-4"/>
                  </Button>
              )}
            </div>
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
