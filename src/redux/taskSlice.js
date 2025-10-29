import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [], // all tasks for all users
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload); // payload includes userId
    },
    updateTask: (state, action) => {
      const { id, updatedTask, userId } = action.payload;
      const index = state.tasks.findIndex((task) => task.id === id && task.userId === userId);
      if (index !== -1) state.tasks[index] = { ...state.tasks[index], ...updatedTask };
    },
    deleteTask: (state, action) => {
      const { id, userId } = action.payload;
      state.tasks = state.tasks.filter((task) => !(task.id === id && task.userId === userId));
    },
    toggleTaskStatus: (state, action) => {
      const { id, userId } = action.payload;
      const task = state.tasks.find((t) => t.id === id && t.userId === userId);
      if (task) {
        task.status =
          task.status === "To Do"
            ? "In Progress"
            : task.status === "In Progress"
            ? "Done"
            : "To Do";
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
