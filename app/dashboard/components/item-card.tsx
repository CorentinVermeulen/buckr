"use client"

import { Button } from "@/components/ui/button";

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
}

export default function ItemCard({ item }: ItemCardProps) {
  const handleOpenUrl = () => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Icon on the left */}
      <div className="text-3xl mr-4 min-w-12 flex items-center justify-center">
        {item.icon || "📦"}
      </div>
      
      {/* Content in the middle */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h3 className="text-lg font-medium">{item.title}</h3>
          
          {/* Price on the right */}
          <div className="font-semibold text-green-600">
            ${item.price.toFixed(2)}
          </div>
        </div>
        
        {/* URL button */}
        {item.url && (
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
      </div>
    </div>
  );
}