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

interface CreateItemDialogProps {
  createItem: (userId: string, formData: FormData) => Promise<void>;
}

export default function CreateItemDialog({ createItem }: CreateItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("📦");
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const user = useUser();

  // Common emojis for items
  const commonEmojis = ["📦", "💻", "📱", "🎮", "👕", "👟", "🎧", "📚", "🏠", "🚗", "⌚", "💍", "🎁", "🛒", "💰"];

  // More emojis for the expanded view
  const allEmojis = [
    ...commonEmojis,
    "🖥️", "⌨️", "🖱️", "🖨️", "📷", "🎥", "📺", "📻", "🔋", "💾", "💿", "📀", "🎞️", 
    "🎹", "🎸", "🎺", "🎻", "🥁", "🎯", "🎲", "🎭", "🎨", "🧩", "🎪", "🎟️", "🎫",
    "👔", "👗", "👘", "👙", "👚", "👛", "👜", "👝", "🧣", "🧤", "🧥", "🧦",
    "👒", "🎩", "🧢", "⛑️", "👑", "👓", "🕶️", "🥽", "🥼", "🦺", "👠", "👡", "👢",
    "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "🔫", "🏹", "🛡️", "🪚", "🔧", "🔩",
    "⚙️", "🗜️", "⚖️", "🔗", "⛓️", "🧰", "🧲", "🧪", "🧫", "🧬", "🔬", "🔭", "📡"
  ];

  if (!user) {
    return null;
  }

  const handleSubmit = async (formData: FormData) => {
    // Add the selected emoji to the form data
    formData.append('icon', selectedEmoji);
    await createItem(user.id, formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="rounded-full w-10 h-10 p-0">
          <span className="text-xl">+</span>
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
                {(showAllEmojis ? allEmojis : commonEmojis).map((emoji, index) => (
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

              <Button 
                type="button" 
                variant="ghost" 
                className="mt-2 text-sm"
                onClick={() => setShowAllEmojis(!showAllEmojis)}
              >
                {showAllEmojis ? "Show fewer emojis" : "Show more emojis"}
              </Button>
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
