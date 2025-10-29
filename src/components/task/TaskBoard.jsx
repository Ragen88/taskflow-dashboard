import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { useSelector, useDispatch } from "react-redux";
import { addTask, toggleTaskStatus, deleteTask, updateTask } from "@/redux/taskSlice";
import { useAuth0 } from "@auth0/auth0-react";

export default function TaskBoard({ selectedBoard }) {
  const { user } = useAuth0(); // get current user
  const dispatch = useDispatch();

  // filter tasks for current user only
  const tasks = useSelector((state) =>
    state.tasks.tasks.filter((t) => t.userId === user?.sub)
  );

  const handleAddTask = (task) => dispatch(addTask({ ...task, userId: user.sub }));
  const handleDeleteTask = (id) => dispatch(deleteTask({ id, userId: user.sub }));
  const handleEditTask = (id, updatedTask) => dispatch(updateTask({ id, updatedTask, userId: user.sub }));
  const handleToggleStatus = (id) => dispatch(toggleTaskStatus({ id, userId: user.sub }));

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="flex gap-6">
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
            className={`flex-1 p-4 rounded-md min-h-[300px] ${
              status === selectedBoard ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <h2 className="font-bold mb-4">{status}</h2>
            {status === "To Do" && <AddTaskForm onAdd={handleAddTask} />}
            {tasks
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
  );
}
