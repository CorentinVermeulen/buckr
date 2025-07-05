"use client"

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface EditItemDialogProps {
  item: ItemType;
  updateItem: (itemId: string, formData: FormData) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditItemDialog({ item, updateItem, deleteItem, open, onOpenChange }: EditItemDialogProps) {
  const [selectedEmoji, setSelectedEmoji] = useState(item.icon || "📦");

  // Common emojis for items
  const commonEmojis = [
    "📦", "🧢", "👕", "🧥", "👖", "🩳", "👟", "👠",
    "🏋️‍♀️", "🚲", "🎧", "⌚", "📱", "💻", "💍", "🎁",
    "🪑", "🍕", "🕶️", "🧳", "✈️", "🏝️", "💡", "🧞‍♂️",
  ];

  const handleSubmit = async (formData: FormData) => {
    // Add the selected emoji to the form data
    formData.append('icon', selectedEmoji);
    await updateItem(item.id, formData);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    await deleteItem(item.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="title"
            placeholder="Title"
            defaultValue={item.title}
            required
          />
          <Input
            type="url"
            name="url"
            placeholder="URL"
            defaultValue={item.url || ""}
          />
          <Input
            type="number"
            name="price"
            placeholder="Price"
            step="0.01"
            defaultValue={item.price}
            required
          />
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-8 gap-2">
                {(commonEmojis).map((emoji, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={selectedEmoji === emoji ? "default" : "outline"}
                    className={`h-10 w-10 p-0 ${selectedEmoji === emoji ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    <span className="text-lg">{emoji}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-between w-full">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
