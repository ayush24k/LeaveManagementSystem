import { useEffect, useState } from "react";
import LeaveService from "../services/LeaveService"
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
};


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
        <div className="min-h-screen bg-slate-200 p-8">
            <div className="max-w-7xl mx-auto pt-8">
                {/* header */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {isAdmin ? 'Team ' : ''}Leave History
                            </h1>
                            <p className="text-gray-600">
                                total leave requsts: {leaves.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* load leaves here */}
                <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-8">
                    {loading ? (
                        <Loader/>
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
                                        Duration: {new Date(leave.startDate).toLocaleDateString()} to {" "}
                                        {new Date(leave.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">Days: {leave.days}</p>
                                    <p className="text-sm">Reason: {leave.reason}</p>
                                    {leave.approvedBy && (
                                        <p className="text-sm text-gray-400">Approved By: {leave.approvedBy}</p>
                                    )}
                                </div>

                                <div
                                    className={`self-start px-3 py-3 text-sm rounded ${leave.status === "Approved"
                                        ? "bg-green-100 text-green-700"
                                        : leave.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {leave.status}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}