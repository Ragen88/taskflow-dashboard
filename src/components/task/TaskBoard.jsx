import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { useSelector, useDispatch } from "react-redux";
import { addTask, toggleTaskStatus, deleteTask, updateTask } from "@/redux/taskSlice";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export default function TaskBoard({ selectedBoard }) {
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tasks for current user
  const tasks = useSelector((state) =>
    state.tasks.tasks.filter((t) => t.userId === user?.sub)
  );

  const handleAddTask = (task) => {
    dispatch(addTask({ ...task, userId: user.sub }));
    setIsDialogOpen(false); // close modal
  };

  const handleDeleteTask = (id) =>
    dispatch(deleteTask({ id, userId: user.sub }));

  const handleEditTask = (id, updatedTask) =>
    dispatch(updateTask({ id, updatedTask, userId: user.sub }));

  const handleToggleStatus = (id) =>
    dispatch(toggleTaskStatus({ id, userId: user.sub }));

  const columns = ["To Do", "In Progress", "Done"];

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
  task.title.replace(/\s+/g, "").toLowerCase().includes(
    searchQuery.replace(/\s+/g, "").toLowerCase()
  )
);

  return (
    <div className="flex flex-col gap-6">
      {/* Board Title + Search + Add Task Button */}
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <h2 className="text-xl sm:text-2xl font-semibold">{selectedBoard} Board</h2>

        <div className="flex items-center gap-2">
          {/* Search Bar - smaller and next to Add Task button */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-sm py-1">Add Task</Button>
            </DialogTrigger>

            <DialogContent className="p-6 w-full max-w-md sm:max-w-md rounded-lg">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Fill out the task details below
                </DialogDescription>
              </DialogHeader>

              <AddTaskForm onAdd={handleAddTask} />

              <div className="flex justify-end mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Task Columns */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {columns.map((status) => {
          const [, drop] = useDrop(() => ({
            accept: "TASK",
            drop: (item) => {
              if (item.status !== status) handleToggleStatus(item.id);
            },
          }));

          return (
            <div
              key={status}
              ref={drop}
              className={`flex-1 p-3 sm:p-4 rounded-md min-h-[280px] ${
                status === selectedBoard ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <h3 className="font-bold mb-3 sm:mb-4">{status}</h3>

              {filteredTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}