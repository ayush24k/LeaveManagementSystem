import { useEffect, useState } from "react";
import LeaveService from "../services/LeaveService";
import Loader from "../components/Loader";
import QuickActionButton from "../components/QuickActionButton";
import { Calendar } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

export default function DashboardPage() {
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentUser = LeaveService.getCurrentUser();
    const isAdmin = currentUser?.role === "admin";

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const leavesData = await LeaveService.getLeaves();
            // get only 5 recent leaves
            setRecentLeaves(leavesData.slice(-5).reverse());
        } catch (err) {
            console.error("Error Loading Dashboard");
        } finally {
            setLoading(false);
        }
    };


    const quickActionLinks = [
        { id: 'applyLeave', label: 'Apply Leave' },
        { id: 'history', label: 'Leave History' },
    ]

    if (currentUser?.role === "admin") {
        quickActionLinks.push(
            { id: 'admin', label: 'Admin Panel' },
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-200">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="bg-slate-200 min-h-screen">
            <div className="max-w-7xl mx-auto p-8">

                {/* heading title */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isAdmin ? 'Admin' : ''} Dashboard
                            </h1>
                            <p className="text-gray-600">
                                welcome {currentUser?.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* grid panel for all views */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8">
                    {/* quick action box */}
                    <div className="md:col-span-1 bg-[#2C2638] p-6 rounded-lg text-white">
                        <h2 className="font-bold text-2xl">Quick Actions</h2>
                        <div className="flex flex-col gap-4 mt-6">
                            {quickActionLinks.map((btn) => (
                                <QuickActionButton key={btn.id} link={btn.id}>
                                    {btn.label}
                                </QuickActionButton>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-3 grid auto-rows-max gap-4">
                        {/* recent leaves */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Recent {isAdmin ? 'Team ' : ''}Leave Requests
                            </h3>
                            {recentLeaves.length > 0 ? (
                                <div className="space-y-3">
                                    {recentLeaves.map((leave: any) => (
                                        <div
                                            key={leave.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-gray-900">
                                                        {isAdmin ? leave.employeeName : leave.type}
                                                    </span>
                                                    <StatusBadge status={leave.status} />
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {leave.startDate} - {leave.endDate}
                                                    <span className="ml-2">({leave.days} days)</span>
                                                </p>
                                                {leave.reason && (
                                                    <p className="text-sm text-gray-500 mt-1 truncate">
                                                        {leave.reason}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No leave requests yet</p>
                                </div>
                            )}
                        </div>

                        {/* leave balance */}
                        {!isAdmin && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
                                <p className="text-gray-600">Show available leave stats here...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}