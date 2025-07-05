"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

interface BacklogItemCardProps {
  item: ItemType;
  updateItem: (itemId: string, formData: FormData) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  markItemAsObtained: (itemId: string, obtained: boolean) => Promise<void>;
}

export default function BacklogItemCard({ 
  item, 
  updateItem, 
  deleteItem, 
  markItemAsObtained
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

  return (
    <>
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

        {/* Right part: Price and checkbox */}
        <div className="flex flex-col items-end justify-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[100px]">
          {/* Price */}
          <div className="font-semibold text-sm sm:text-base">
            ${item.price.toFixed(2)}
          </div>

          {/* Check button to mark as obtained */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0"
            onClick={handleMarkAsObtained}
          >
            <HandCoins className="h-3 w-3 sm:h-4 sm:w-4"/>
          </Button>
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
