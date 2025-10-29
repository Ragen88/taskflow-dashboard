import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [], // all tasks will be stored here
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const { id, updatedTask } = action.payload;
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index !== -1) state.tasks[index] = { ...state.tasks[index], ...updatedTask };
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
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
