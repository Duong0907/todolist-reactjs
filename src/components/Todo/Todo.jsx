import { useEffect } from "react";

const Todo = ({todo, index, changeTaskStatus, deleteTask}) => {
    useEffect(() => {
        console.log(todo)
    });

    return (
        <div
            key={index}
            className="rounded mt-4 p-2 d-flex"
            style={{
                backgroundColor: todo.completed ? "#87FC68" : "LightGray",
            }}
        >
            <div className="me-auto">{todo.task}</div>
            <div>
                <i
                    className={
                        "h5 me-2 " +
                        (todo.completed ? "bi bi-check-square" : "bi bi-square")
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => changeTaskStatus(todo.id)}
                ></i>
                <i
                    className="bi bi-trash text-danger h5"
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteTask(todo.id)}
                ></i>
            </div>
        </div>
    );
};

export default Todo;
