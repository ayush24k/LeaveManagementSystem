import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import App from "./App";
import DashboardPage from "./pages/DashboardPage";
import LeavePage from "./pages/LeavePage";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'applyLeave', element: <LeavePage /> },
        ]
    },
])