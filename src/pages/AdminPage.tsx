import { useEffect, useState } from "react";
import LeaveService from "../services/LeaveService";
import Loader from "../components/Loader";

interface LeaveType {
    id: string;
    employeeId: string;
    employeeName: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: string;
    appliedDate: string;
    approvedBy: string;
}

export default function AdminPage() {
    const [leaves, setLeaves] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(false);

    const currentUser = LeaveService.getCurrentUser();
    const isAdmin = currentUser.role === "admin";

    useEffect(() => {
        loadLeavesHistory();
    }, []);

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

    const handleUpdateStatus = async (leaveId: string, status: "Approved" | "Rejected") => {
        try {
            setLoading(true);
            await LeaveService.updateLeaveStatus(leaveId, status);
            setLeaves((prev) =>
                prev.map((leave) =>
                    leave.id === leaveId
                        ? { ...leave, status, approvedBy: currentUser.username }
                        : leave
                )
            );
        } catch (err) {
            console.log(`Error updating status to ${status}`, err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen bg-slate-200 p-8">
            <div className="max-w-7xl mx-auto pt-8">
                {/* header */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isAdmin ? "Team " : ""}Approve/Reject Team Leaves
                            </h1>
                            <p className="text-gray-600">total requests</p>
                        </div>
                    </div>
                </div>

                {/* load leaves here */}
                <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-8">
                    {loading ? (
                        <Loader />
                    ) : leaves.length === 0 ? (
                        <p>No leave requests found</p>
                    ) : (
                        leaves.map((leave) => (
                            <div
                                key={leave.id}
                                className="bg-[#2C2638] text-white p-4 rounded-lg shadow flex justify-between"
                            >
                                <div>
                                    <h1 className="font-semibold text-lg">{leave.employeeName}</h1>
                                    <p className="text-sm text-gray-400">
                                        Applied: {new Date(leave.appliedDate).toLocaleDateString()}
                                    </p>

                                    {/* leave details */}
                                    <p className="text-sm">Type: {leave.type}</p>
                                    <p className="text-sm">
                                        Duration: {new Date(leave.startDate).toLocaleDateString()} to{" "}
                                        {new Date(leave.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">Days: {leave.days}</p>
                                    <p className="text-sm">Reason: {leave.reason}</p>
                                    {leave.approvedBy && (
                                        <p className="text-sm text-gray-400">
                                            Approved By: {leave.approvedBy}
                                        </p>
                                    )}

                                    {/* arpporve and reject button */}
                                    {isAdmin && leave.status === "Pending" && (
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(leave.id, "Approved")}
                                                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                                            >
                                                {loading ? "Approving" : "Approve"}
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(leave.id, "Rejected")}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                                            >
                                                {loading ? "Rejecting" : "Reject"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <span
                                    className={`self-start px-3 py-1 text-sm rounded font-medium ${leave.status === "Approved"
                                            ? "bg-green-100 text-green-700"
                                            : leave.status === "Pending"
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
    );
}
