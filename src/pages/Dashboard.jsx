import TaskBoard from "@/components/task/TaskBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, CheckIcon, ClockIcon } from "lucide-react";

export default function Dashboard() {
  const [selectedBoard, setSelectedBoard] = useState("To Do");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar selected={selectedBoard} onSelect={setSelectedBoard} />
        </div>

        <main className="flex-1 p-4 sm:p-6">
          {/* Mobile board selector */}
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto">
            {[
              { name: "To Do", icon: <ClockIcon className="w-4 h-4" /> },
              { name: "In Progress", icon: <HomeIcon className="w-4 h-4" /> },
              { name: "Done", icon: <CheckIcon className="w-4 h-4" /> },
            ].map((b) => (
              <Button
                key={b.name}
                size="sm"
                variant={selectedBoard === b.name ? "default" : "outline"}
                className="shrink-0"
                onClick={() => setSelectedBoard(b.name)}
              >
                {b.icon}
                <span className="ml-2">{b.name}</span>
              </Button>
            ))}
          </div>

          {/* Removed the dashboard title */}
          <DndProvider backend={HTML5Backend}>
            <TaskBoard selectedBoard={selectedBoard} />
          </DndProvider>
        </main>
      </div>
    </div>
  );
}
