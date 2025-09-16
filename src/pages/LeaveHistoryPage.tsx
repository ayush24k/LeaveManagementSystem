import { useEffect, useState } from "react";
import LeaveService from "../services/LeaveService"

interface LeaveType {
    id: string;
    employeeName: string;
    appliedDate: string;
    status: string;
    // add other fields from your API here
}

export default function LeaveHistoryPage() {
    const [leaves, setLeaves] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(false);


    const currentUser = LeaveService.getCurrentUser();
    const isAdmin = currentUser.role === "admin"

    useEffect(() => {
        loadLeavesHistory();
    }, [])


    // load leaves in sorted manner
    const loadLeavesHistory = async () => {
        try {
            setLoading(true);
            const data: LeaveType[] = await LeaveService.getLeaves();
            const sorted = data.sort(
                (a, b) =>
                    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
            );
            setLeaves(sorted);
        } catch (err) {
            console.log("Error Loading Leave History", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-screen bg-slate-200">
            <div className="max-w-7xl mx-auto pt-8">
                {/* header */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isAdmin ? 'Team ' : ''}Leave History
                            </h1>
                            <p className="text-gray-600">
                                total requests
                            </p>
                        </div>
                    </div>
                </div>

                {/* load leaves here */}
                <div className="mt-6 space-y-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : leaves.length === 0 ? (
                        <p>No leave requests found.</p>
                    ) : (
                        leaves.map((leave) => (
                            <div
                                key={leave.id}
                                className="bg-white p-4 rounded-lg shadow flex justify-between"
                            >
                                <div>
                                    <p className="font-semibold">{leave.employeeName}</p>
                                    <p className="text-sm text-gray-600">
                                        Applied: {new Date(leave.appliedDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm rounded ${leave.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : leave.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {leave.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}