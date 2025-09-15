import { useState } from "react"
import LeaveService from "../services/LeaveService";
import { calculateDays } from "../utils/calculateDays";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";
import Loader from "../components/Loader";

type FormFieldsType = {
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
};

export default function ApplyLeavePage() {
    const naviagte = useNavigate();
    const [formData, setFormData] = useState<FormFieldsType>({
        type: 'Annual Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const leaveTypes = [
        'Annual Leave',
        'Sick Leave',
        'Emergency Leave',
    ];

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-adjust end date if start date changes
        if (name === 'startDate' && value && formData.endDate && value > formData.endDate) {
            setFormData(prev => ({
                ...prev,
                endDate: value
            }));
        }
    };

    // TODO: add validation for form

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        try {
            const days = calculateDays(formData.startDate, formData.endDate);

            const leaveRequest = {
                ...formData,
                days,
                reason: formData.reason.trim()
            };

            const success = await LeaveService.submitLeave(leaveRequest);

            // Reset form
            setFormData({
                type: 'Annual Leave',
                startDate: '',
                endDate: '',
                reason: ''
            });

            if (success) {
                naviagte('/history')
            }
        } catch (error) {
            console.log('Failed to submit leave request');
        } finally {
            setLoading(false);
        }
    };

    //to add: calcuate days for form enable disable


    return (
        <div className="h-screen bg-slate-200">
            <div className="max-w-2xl mx-auto pt-16">
                <div className="bg-[#2C2638] rounded-xl shadow-sm border border-gray-200 p-8 text-white">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-100 mb-2">Apply for Leave</h1>
                        <p className="text-slate-300">Fill in the details below to submit your leave request</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* leave type */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-white mb-2">
                                Leave Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className={`w-full bg-slate-200 text-gray-700 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.type ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                {leaveTypes.map(type => (
                                    <option key={type} value={type} className="text-black">
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                            {/* start date */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6D54B5] w-5 h-5" />
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        required
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-200 text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.startDate ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6D54B5] w-5 h-5" />
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        required
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate}
                                        className={`w-full pl-10 bg-slate-200 text-gray-700 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.endDate ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-white mb-2">
                                Reason for Leave <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <textarea
                                    id="reason"
                                    name="reason"
                                    required
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.reason ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Please provide a detailed reason for your leave request..."
                                />
                            </div>
                            <div className="mt-1 flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    {formData.reason.length}/500
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#6D54B5] hover:bg-[#544289] disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader size="sm" className="mr-2 text-white" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-5 h-5 mr-2" />
                                        Submit Leave Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}