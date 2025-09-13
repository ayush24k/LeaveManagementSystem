import { Calendar, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState, type ChangeEvent } from "react";
import Loader from "../components/Loader";
import LeaveService from "../services/LeaveService";
import { useOutletContext } from "react-router-dom";

interface FormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const {handleLogin} = useOutletContext<any>();

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please fill all the fields")
            return;
        }

        setLoading(true);
        setError('');

        // login mock
        try {
            const user = await LeaveService.login(formData.email, formData.password);
            handleLogin(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return;
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    }

    const fillDemoCredentials = (role: string) => {
        if (role === 'admin') {
            setFormData({
                email: 'admin@gmail.com',
                password: 'admin123'
            });
        } else {
            setFormData({
                email: 'ayush@gmail.com',
                password: 'password123'
            });
        }
    }

    return (
        <div className="min-h-screen bg-slate-200 flex items-center justify-center">
            <div className="text-white max-w-lg w-full bg-[#2C2638] p-4 rounded-2xl shadow-lg">
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <div className="bg-[#6D54B5] rounded-full p-3">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-semibold">Leave Management System</h1>
                    </div>
                </div>

                <div className="">
                    <p className="text-center text-md text-[#b4adad] mb-4">login to mange your leaves</p>

                    {/* form */}
                    <form onSubmit={handleSubmit} className="space-y-6 px-4">
                        {/* email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-2">
                                <p className="text-sm">Error: <span className="text-red-600">{error}</span></p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#6D54B5] hover:bg-[#462c95] disabled:bg-[#332755] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader size="sm" className="mr-2 text-white" />
                                    Logging In...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>
                    <div className="mt-8 pt-6 border-t border-gray-200 mx-8 mb-8">
                        <p className="text-sm text-white text-center mb-4">
                            Demo Credentials
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('employee')}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-[#462c95] transition-colors"
                            >
                                Emplooyee Login
                            </button>
                            <button
                                type="button"
                                onClick={() => fillDemoCredentials('admin')}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-[#462c95] transition-colors"
                            >
                                Admin Login
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}