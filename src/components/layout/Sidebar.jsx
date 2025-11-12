import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  CheckIcon,
  ClockIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const boards = [
  { name: "To Do", icon: <ClockIcon className="w-4 h-4" /> },
  { name: "In Progress", icon: <HomeIcon className="w-4 h-4" /> },
  { name: "Done", icon: <CheckIcon className="w-4 h-4" /> },
];

export default function Sidebar({ selected, onSelect }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-muted border-r border-border h-full flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        {!collapsed && (
          <h2 className="font-bold text-lg text-foreground">Boards</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Boards */}
      <nav className="flex flex-col gap-2 px-2">
        {boards.map((board) => (
          <Button
            key={board.name}
            variant={selected === board.name ? "default" : "ghost"}
            className={`transition-all ${
              collapsed ? "justify-center px-2" : "justify-start gap-2 px-3"
            }`}
            onClick={() => onSelect(board.name)}
          >
            {board.icon}
            {!collapsed && <span>{board.name}</span>}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
