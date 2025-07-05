"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, HandCoins, ArrowRight, Trash, ShoppingBag } from "lucide-react";
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

interface BacklogItemCardProps {
  item: ItemType;
  updateItem: (itemId: string, formData: FormData) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  markItemAsObtained: (itemId: string, obtained: boolean) => Promise<void>;
  moveToPlanned?: (itemId: string) => Promise<void>;
}

export default function BacklogItemCard({ 
  item, 
  updateItem, 
  deleteItem, 
  markItemAsObtained,
  moveToPlanned
}: BacklogItemCardProps) {
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

  const handleMoveToPlanned = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    if (moveToPlanned) {
      moveToPlanned(item.id);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div 
            className="w-full flex border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4"
            onClick={() => setEditDialogOpen(true)}
          >
            {/* Left part: Icon centered */}
            <div className="flex items-center justify-center w-auto px-2 sm:px-3">
              <div className="text-2xl sm:text-3xl">
                {item.icon || "📦"}
              </div>
            </div>

            {/* Center part: Title and URL button */}
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
            </div>

            {/* Right part: Price and action buttons */}
            <div className="flex flex-col items-end justify-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[100px]">
              {/* Price */}
              <div className="font-semibold text-sm sm:text-base">
                ${item.price.toFixed(2)}
              </div>

              {/* Action buttons - only shown on mobile */}
              <div className="flex sm:hidden flex-row gap-1 mt-1">
                {/* Move to planned button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-7 w-7 p-0"
                  onClick={handleMoveToPlanned}
                  title="Move to planned"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M2 12h10"/>
                    <path d="m7 7 5 5-5 5"/>
                    <path d="M12 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3"/>
                  </svg>
                </Button>

                {/* Check button to mark as obtained */}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-7 w-7 p-0"
                  onClick={handleMarkAsObtained}
                  title="Mark as obtained"
                >
                  <HandCoins className="h-3 w-3"/>
                </Button>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => moveToPlanned && moveToPlanned(item.id)}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Move to Planned
          </ContextMenuItem>
          <ContextMenuItem onClick={() => markItemAsObtained(item.id, true)}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mark as Bought
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => {
            setEditDialogOpen(false);
            deleteItem(item.id);
          }}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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
