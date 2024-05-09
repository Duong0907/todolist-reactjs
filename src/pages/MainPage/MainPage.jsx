import { useEffect, useState } from "react";
import { request, setAccessToken, clearAccessToken } from "../../axios-helper";

import LoginForm from "../../components/LoginForm/LoginForm";
import TodoList from "../../components/TodoList/TodoList";
import NavBar from "../../components/NavBar/NavBar";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import toast, { Toaster } from "react-hot-toast";

const renderAfterAuthentication = async (setState) => {
    return request("GET", "/api/users/me")
        .then((res) => {
            if (!res.data.error) {
                setState({
                    componentToShow: "todolist",
                    isLoggedin: true,
                    isLoading: true,
                    user: res.data.data.user,
                });
            } else {
                setState({
                    componentToShow: "login",
                    isLoggedin: false,
                    isLoading: false,
                    user: {},
                });
            }
        })
        .catch((err) => {
            setState({
                componentToShow: "login",
                isLoggedin: false,
                isLoading: false,
                user: {},
            });
        });
};

const MainPage = () => {
    const [state, setState] = useState({
        componentToShow: "login",
        isLoggedin: false,
        isLoading: true,
        user: {},
    });

    // Check authentication before entering the web page
    useEffect(() => {
        renderAfterAuthentication(setState);
    }, []);

    if (!state.isLoggedin && state.isLoading) {
        return "Loading...";
    }

    // Functions to handling login
    const login = () => {
        setState({
            componentToShow: "login",
            isLoggedin: false,
            isLoading: false,
            user: {},
        });
    };

    const logout = () => {
        toast.success("Log out successfully");
        clearAccessToken();
        login();
    };

    const onLogin = (event, email, password) => {
        event.preventDefault();
        request("POST", "/api/login", {
            email: email,
            password: password,
        })
            .then((res) => {
                if (!res.data.error) {
                    toast.success("Log in successfully");
                    setAccessToken(res.data.data.access_token);
                    renderAfterAuthentication(setState);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    const onRegister = (event, firstname, lastname, email, password) => {
        event.preventDefault();
        request("POST", "/api/users/", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
        })
            .then((res) => {
                if (!res.data.error) {
                    toast.success("Register successfully");
                    login();
                } else {
                    // Need to show error message
                    toast.error("Something went wrong");
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <div>
            <NavBar
                logout={logout}
                loggedin={state.isLoggedin}
                firstname={state.user.firstname}
                lastname={state.user.lastname}
            ></NavBar>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col">
                        {state.componentToShow === "todolist" && (
                            <TodoList userId={state.user.id}></TodoList>
                        )}
                        {state.componentToShow === "login" && (
                            <LoginForm
                                onLogin={onLogin}
                                onRegister={onRegister}
                                isActive="login"
                            ></LoginForm>
                        )}
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

export default MainPage;
