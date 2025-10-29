import TaskBoard from "@/components/task/TaskBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";

export default function Dashboard() {
  const [selectedBoard, setSelectedBoard] = useState("To Do");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar selected={selectedBoard} onSelect={setSelectedBoard} />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">{selectedBoard} Board</h2>
          <DndProvider backend={HTML5Backend}>
            <TaskBoard selectedBoard={selectedBoard} />
          </DndProvider>
        </main>
      </div>
    </div>
  );
}
