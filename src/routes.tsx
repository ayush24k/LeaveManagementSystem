import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import App from "./App";
import DashboardPage from "./pages/DashboardPage";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import LeaveHistoryPage from "./pages/LeaveHistoryPage";
import AdminPage from "./pages/AdminPage";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'applyLeave', element: <ApplyLeavePage /> },
            { path: 'history', element: <LeaveHistoryPage /> },
            { path: 'admin', element: <AdminPage /> },
        ]
    },
])