import { useDrag } from "react-dnd";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TaskCard({ task, onDelete, onEdit }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    onEdit(task.id, { title, description });
    setIsEditing(false);
  };

  return (
    <div
      ref={drag}
      className={`p-4 mb-3 bg-card rounded-md shadow flex flex-col gap-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1 rounded"
          />
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
