import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onAdd({ id: Date.now(), title, description, status: "To Do" });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
      <input
        className="p-2 border rounded-md"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="p-2 border rounded-md"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}
