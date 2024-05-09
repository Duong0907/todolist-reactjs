import { useEffect, useState } from "react";
import { request } from "../../axios-helper";
import Todo from "../Todo/Todo";
import toast from "react-hot-toast";

const TodoList = (props) => {
    const [todos, setTodos] = useState([]);

    // Functions to update data in db
    const getAllTodos = () => {
        request("GET", "/api/todos/")
            .then((res) => {
                if (!res.data.error) {
                    console.log(res.data.data)
                    let newTodos = res.data.data.todo.map((todo) => ({
                        id: todo.id,
                        task: todo.title,
                        completed: todo.status == "Done",
                    }));

                    setTodos(newTodos);
                    setState({ onLoading: false });
                } else {
                    alert(res.data.message);
                }
            })
            .catch((error) => {
                alert(error);
                setState({ onLoading: false });
            });
    };

    const createTodoInDb = (todo) => {
        return request("POST", "/api/todos/", todo);
    };

    const changeTodoStatusInDb = (todo) => {
        console.log("IDD: ", todo.id);
        let status = todo.status === "Done" ? "Todo" : "Done";
        console.log(todo);

        return request("PUT", "/api/todos/" + todo.id, {
            status: status,
        });
    };

    const deleteTodoInDb = (id) => {
        return request("DELETE", "/api/todos/" + id);
    };

    // Get all todos when entering page
    const [state, setState] = useState({
        onLoading: true,
    });

    useEffect(() => {
        getAllTodos();
    }, []);

    if (state.onLoading) {
        return "Loading...";
    }

    // Event handers
    const handleSubmit = (event) => {
        event.preventDefault();

        let task = event.target.task.value;

        if (!task) {
            toast.error("Please provide a valid task!");
            return;
        }

        createTodoInDb({
            title: task,
            status: "Todo",
        }).then((res) => {
            if (!res.data.error) {
                setTodos([
                    ...todos,
                    {
                        task: res.data.data.todo.title,
                        completed: res.data.data.todo.status === "Done",
                        id: res.data.data.todo.id,
                    },
                ]);

                document.getElementById("task").value = "";
            } else {
                alert(res.data.message);
            }
        });
    };

    const changeTaskStatus = (id) => {
        let newTodos = [...todos];
        for (let i = 0; i < newTodos.length; i++) {
            if (newTodos[i].id === id) {
                changeTodoStatusInDb({
                    status: newTodos[i].completed ? "Done" : "Todo",
                    id: id,
                }).then((res) => {
                    if (!res.data.error) {
                        newTodos[i].completed = !newTodos[i].completed;
                        setTodos(newTodos);
                    }
                });
                return;
            }
        }
    };

    const deleteTask = (id) => {
        let newTodos = [...todos];
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id === id) {
                deleteTodoInDb(todos[i].id).then((res) => {
                    if (!res.data.error) {
                        toast.success(res.data.message);
                        newTodos.splice(i, 1);
                        setTodos(newTodos);
                    }
                });
                return;
            }
        }
    };

    return (
        <div className="container" id="container">
            <div
                className="mx-auto rounded border p-4"
                style={{ width: "600px", backgroundColor: "#06818d" }}
            >
                <form action="" className="d-flex" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="New Task"
                        id="task"
                    />
                    <button type="submit" className="btn btn-outline-light">
                        Add
                    </button>
                </form>
                <div data-spy="scroll" data-offset="0" data-target="#container">

                    {todos.map((todo, index) => {
                        return (
                            <Todo todo={todo} index={index} changeTaskStatus={changeTaskStatus} deleteTask={deleteTask}></Todo>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TodoList;
