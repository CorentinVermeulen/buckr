"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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

interface ObtainedItemCardProps {
  item: ItemType;
  updateItem: (itemId: string, formData: FormData) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  markItemAsObtained: (itemId: string, obtained: boolean) => Promise<void>;
}

export default function ObtainedItemCard({ 
  item, 
  updateItem, 
  deleteItem, 
  markItemAsObtained
}: ObtainedItemCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMarkAsObtained = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event from firing
    markItemAsObtained(item.id, !item.obtained);
  };

  return (
    <>
      <div className="mb-1">
        <div
          className="w-full flex items-center border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-muted py-1 px-2 sm:px-3"
          onClick={() => setEditDialogOpen(true)}
        >
          {/* Left part: Icon centered */}
          <div className="flex items-center justify-center w-auto px-1 sm:px-2">
            <div className="text-base sm:text-xl">
              {item.icon || "📦"}
            </div>
          </div>

          {/* Center part: Title */}
          <div className="flex-1 flex flex-row items-center">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Title */}
              <h3 className="text-xs sm:text-sm font-medium truncate">{item.title}</h3>
            </div>
          </div>

          {/* Right part: Price and checkbox */}
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 min-w-[70px] sm:min-w-[100px]">
            {/* Price */}
            <div className="font-semibold text-xs sm:text-sm mr-1 sm:mr-2">
              ${item.price.toFixed(2)}
            </div>

            {/* Check button to mark as not obtained */}
            <Button
              variant="default"
              size="sm"
              className="rounded-full bg-green-500 hover:bg-green-600 h-5 w-5 sm:h-6 sm:w-6 p-0"
              onClick={handleMarkAsObtained}
            >
              <Check className="h-2 w-2 sm:h-3 sm:w-3"/>
            </Button>
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
