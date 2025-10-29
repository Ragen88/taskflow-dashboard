import { Button } from "@/components/ui/button";
import { HomeIcon, CheckIcon, ClockIcon } from "lucide-react";

const boards = [
  { name: "To Do", icon: <ClockIcon className="w-4 h-4 mr-2" /> },
  { name: "In Progress", icon: <HomeIcon className="w-4 h-4 mr-2" /> },
  { name: "Done", icon: <CheckIcon className="w-4 h-4 mr-2" /> },
];

export default function Sidebar({ selected, onSelect }) {
  return (
    <aside className="w-64 bg-muted p-4 flex flex-col gap-4 border-r border-border">
      <h2 className="font-bold text-lg mb-2 text-foreground">Boards</h2>
      {boards.map((board) => (
        <Button
          key={board.name}
          variant={selected === board.name ? "default" : "ghost"}
          className="justify-start gap-2"
          onClick={() => onSelect(board.name)}
        >
          {board.icon}
          {board.name}
        </Button>
      ))}
    </aside>
  );
}
