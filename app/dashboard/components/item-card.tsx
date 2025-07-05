"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, HandCoins, ArrowUp, ArrowDown, Trash, Archive, ShoppingBag } from "lucide-react";
import EditItemDialog from "./edit-item-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  remainingCost? : number;
  remainingTimeInMonths? : number;
  isPlanned?: boolean;
  currentBalance?: number;
  sparing?: number;
  isLast?: boolean;
  moveItemUp?: (itemId: string) => Promise<void>;
  moveItemDown?: (itemId: string) => Promise<void>;
  moveToBacklog?: (itemId: string) => Promise<void>;
  itemIndex?: number | null;
}

export default function ItemCard({
  item,
  updateItem,
  deleteItem,
  markItemAsObtained,
  priceInMonths,
  cumulativePrice,
  remainingCost,
  remainingTimeInMonths,
  isPlanned = false,
  currentBalance = 0,
  sparing = 0,
  isLast = false,
  moveItemUp,
  moveItemDown,
  moveToBacklog,
  itemIndex
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

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (moveItemUp) {
      moveItemUp(item.id);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (moveItemDown) {
      moveItemDown(item.id);
    }
  };

  const handleMoveToBacklog = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (moveToBacklog) {
      moveToBacklog(item.id);
    }
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
                      {remainingTimeInMonths !== undefined && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {remainingTimeInMonths.toFixed(1)} mo
                          </Badge>
                      )}
                      {remainingCost !== undefined && (
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            ${remainingCost.toFixed(2)}
                          </Badge>
                      )}
                    </div>

                    <div className="relative">
                      {!isLast && (
                        <div className="absolute w-0.5 h-16 bg-gray-200 top-12 left-1/2 transform -translate-x-1/2"/>
                      )}
                      <div className="rounded-full bg-gray-100 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <span className="font-medium text-sm sm:text-base">
                          {!item.obtained && itemIndex ? itemIndex : priceInMonths?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Main card content - full width on mobile, 4/5 width on larger screens */}
          <ContextMenu >
            <ContextMenuTrigger className="w-full">
              <div
                className={`w-full flex border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4
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
                      {remainingTimeInMonths !== undefined && (
                        <Badge variant="outline" className="text-xs">
                          ~ {remainingTimeInMonths.toFixed(1)} mo
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
                              ~ {priceInMonths.toFixed(1)} months
                            </Badge>
                        )}
                      </div>
                  )}
                </div>

                {/* Right part: Next month badge, price, and action buttons */}
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

                  {/* Action buttons - only shown on mobile for reordering */}
                  <div className="flex sm:hidden flex-row gap-1 mt-1">
                    {/* Reorder buttons - only shown for planned items that are not obtained */}
                    {isPlanned && !item.obtained && (
                      <div className="flex flex-row gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full h-7 w-7 p-0"
                          onClick={handleMoveUp}
                          title="Move up"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="m18 15-6-6-6 6"/>
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full h-7 w-7 p-0"
                          onClick={handleMoveDown}
                          title="Move down"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex sm:hidden flex-row gap-1 mt-1">
                    {/* Move to backlog button - only shown for planned items that are not obtained */}
                    {isPlanned && !item.obtained && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-7 w-7 p-0"
                        onClick={handleMoveToBacklog}
                        title="Move to backlog"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                          <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/>
                        </svg>
                      </Button>
                    )}

                    {/* Check button to mark as obtained - only shown if it's available (mobile view) */}
                    {isAvailable && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-7 w-7 p-0"
                        onClick={handleMarkAsObtained}
                        title="Mark as obtained"
                      >
                        <HandCoins className="h-3 w-3"/>
                      </Button>
                    )}
                  </div>

                  {/* Check button to mark as obtained - visible on all screen sizes */}
                  {isAvailable && (
                    <div className="hidden sm:flex mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-8 w-8 p-0"
                        onClick={handleMarkAsObtained}
                        title="Mark as bought"
                      >
                        <HandCoins className="h-4 w-4"/>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </ContextMenuTrigger>

            <ContextMenuContent>
              {isPlanned && !item.obtained && (
                <>
                  <ContextMenuItem onClick={() => moveItemUp && moveItemUp(item.id)}>
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Move Up
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => moveItemDown && moveItemDown(item.id)}>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    Move Down
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => moveToBacklog && moveToBacklog(item.id)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Move to Backlog
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </>
              )}
              <ContextMenuItem onClick={() => markItemAsObtained(item.id, true)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Mark as Bought
              </ContextMenuItem>
              <ContextMenuItem onClick={() => {
                setEditDialogOpen(false);
                deleteItem(item.id);
              }}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
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
