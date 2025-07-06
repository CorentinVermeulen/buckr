"use client"

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";

interface CreateItemDialogProps {
  createItem: (userId: string, formData: FormData) => Promise<void>;
  isPlanned?: boolean;
}

export default function CreateItemDialog({ createItem, isPlanned = false }: CreateItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("📦");
  const user = useUser();

  // Common emojis for items
  const commonEmojis = [
    "📦", "🧢", "👕", "🧥", "👖", "🩳", "👟", "👠",
    "🏋️‍♀️", "🚲", "🎧", "⌚", "📱", "💻", "💍", "🎁",
    "🪑", "🍕", "🕶️", "🧳", "✈️", "🏝️", "💡", "🧞‍♂️",
  ];


  if (!user) {
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    // Add the selected emoji to the form data
    formData.append('icon', selectedEmoji);
    // Add the isPlanned value to the form data
    formData.append('isPlanned', isPlanned.toString());
    await createItem(user.id, formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-full w-10 h-10 p-0">
          <span className="text-xl"><PlusIcon className={"stroke-4"}/></span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="title"
            placeholder="Title"
            required
          />
          <Input
            type="url"
            name="url"
            placeholder="URL"
          />
          <div className="space-y-2">
            <Textarea
              name="description"
              placeholder="Description"
              className="resize-y"
            />
          </div>
          <Input
            type="number"
            name="price"
            placeholder="Price"
            step="0.01"
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
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
