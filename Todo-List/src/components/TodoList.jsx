import { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tasks!", error);
      });
  }, []);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      if (isEditing) {
        const updatedTasks = tasks.map((task, index) =>
          index === currentTaskIndex ? { ...task, title: newTask } : task
        );
        setTasks(updatedTasks);
        setIsEditing(false);
        setCurrentTaskIndex(null);

        axios
          .put(`http://localhost:3001/tasks/${tasks[currentTaskIndex].id}`, {
            title: newTask,
          })
          .catch((error) => {
            console.error("There was an error updating the task!", error);
          });
      } else {
        const task = { title: newTask };

        axios
          .post("http://localhost:3001/tasks", task)
          .then((response) => {
            setTasks([...tasks, response.data]);
            setNewTask("");
          })
          .catch((error) => {
            console.error("There was an error adding the task!", error);
          });
      }
    }
  };
  const handleEditTask = (index) => {
    setNewTask(tasks[index].title);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
      <input
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={newTask}
        onChange={handleInputChange}
        placeholder="Enter a new task"
      />
      <button
        className=" mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={handleAddTask}
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>
      <ul className="mt-4 space-y-2">
        {tasks.map((task, index) => (
          <li key={index.id}>
            {task.title}
            <button
              className="text-blue-500 hover:underline "
              onClick={() => handleEditTask(index)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
