import { useLocation, useNavigate } from "react-router-dom";
import { getUserContext } from "../contexts/UserContext";
import LeaveService from "../services/LeaveService";
import { Calendar, LogOut } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, setCurrentUser } = getUserContext();


    const navLinks = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'applyLeave', label: 'Apply Leave' },
        { id: 'history', label: 'Leave History' },
    ]

    if (currentUser?.role === "admin") {
        navLinks.push(
            { id: 'admin', label: 'Admin Panel' },
        );
    }


    const handleLogout = async () => {
        try {
            LeaveService.logout();
            setCurrentUser(null);
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="bg-slate-400">
            <nav className="bg-[#2C2638] shadow-sm border-b border-gray-200">
                <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-22">
                        {/* logo */}
                        <div className="flex items-center">
                            <Calendar className="w-8 h-8 text-[#6D54B5]" />
                            <h1 className="ml-2 text-xl font-semibold text-white">
                                Leave Management System
                            </h1>
                        </div>
                        {/* nav items */}

                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((item) => {
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`${item.id}`)}
                                        className={`
                                            flex items-center text-white px-3 py-2 text-md font-medium rounded-md transition-colors
                                            ${location.pathname === `/${item.id}` ? 'text-[#6D54B5] bg-[#3a2d62] border-white border shadow-2xl shadow-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/60'}
                                            `}
                                    >{item.label}</button>
                                )
                            })};
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-sm font-medium text-white">
                                    {currentUser?.name}
                                </span>
                                <span className="text-xs text-gray-200 capitalize">
                                    {currentUser?.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 text-sm text-[#6D54B5] hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* mobile menu */}
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex gap-3 space-x-1">
                            {navLinks.map(item => {
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`/${item.id}`)}
                                        className={`
                                                    flex flex-col items-center px-3 py-2 text-white text-xs rounded-md transition-colors
                                                    ${location.pathname === `/${item.id}` ? 'text-[#6D54B5] bg-[#3a2d62] border-white border shadow-2xl shadow-white/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/60'}
                                     `}
                                    >{item.label}</button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}