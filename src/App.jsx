import { useState, useEffect } from "react";
import "./App.css";


const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const TodoApp = () => {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      text: input,
      completed: false,
      // created_at: Date.now(),
      // completed_at: null,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, completed_at: todo.completed ? null : Date.now() }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) {
      return a.completed ? a.completed_at - b.completed_at : b.created_at - a.created_at;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="todo-container">
      <h2>Yo! Apps Todo List</h2>
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
          aria-label="New todo input"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className={todo.completed ? "completed" : ""}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
            <button
              className="delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
              }}
              aria-label={`Delete ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.some((todo) => todo.completed) && (
        <button onClick={clearCompleted} className="clear-completed">Clear Completed</button>
      )}
    </div>
  );
};

export default TodoApp;