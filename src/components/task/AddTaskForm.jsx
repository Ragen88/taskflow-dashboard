import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ id: Date.now(), title, description, status: "To Do" });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="flex flex-col gap-3 mb-4" onSubmit={handleSubmit}>
      <input
        className="p-2 border border-border rounded-md 
                   bg-input text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="p-2 border border-border rounded-md 
                   bg-input text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Button type="submit">Add Task</Button>
    </form>
  );
}
