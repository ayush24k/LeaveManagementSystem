// mock leavve service api and login 

import { INITIAL_LEAVES } from "../MockData/InitialLeaves";
import { INITIAL_USER } from "../MockData/InitialUser";


class LeaveService {
    constructor() {
        this.initialData();
    }

    initialData() {
        if (!localStorage.getItem('leaves')) {
            localStorage.setItem('leaves', JSON.stringify(INITIAL_LEAVES));
        }
    }

    // login API Mocked
    async login(email: string, password: string) {

        // timer so it looks like a real api call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === 'admin@gmail.com' && password === 'admin123') {
            const adminUser = {
                ...INITIAL_USER,
                id: 'ADMIN1',
                name: 'Admin User',
                email: email,
                role: 'admin'
            };
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            return adminUser;
        } else {
            const name = email.replace('@gmail.com', '');
            const employeeUser = {
                ...INITIAL_USER,
                id: `EMP${name}`,
                name: name,
                email: email,
                role: 'employee'
            }
            localStorage.setItem('currentUser', JSON.stringify(employeeUser));
            return employeeUser;
        }
    };

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }


    // submit leave
    async submitLeave(leaveData: any) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        const currentUser = this.getCurrentUser();

        const newLeave = {
            id: Math.max(...leaves.map((l: any) => l.id), 0) + 1, // finds the highest id number if exists and adds 1 to prevent same ids
            employeeId: currentUser.id,
            employeeName: currentUser.name,
            ...leaveData,
            status: 'Pending',
            appliedDate: new Date().toISOString().split('T')[0],
            approvedBy: null
        };

        leaves.push(newLeave);
        localStorage.setItem('leaves', JSON.stringify(leaves));

        return newLeave;
    }

    // get leave
    async getLeaves() {
        await new Promise(resolve => setTimeout(resolve, 500));

        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        const currentUser = this.getCurrentUser();

        if (currentUser?.role === 'admin') {
            return leaves;
        }

        return leaves.filter((leave: any) => leave.employeeId === currentUser?.id);
    }


    // update leave status
    async updateLeaveStatus(leaveId: any, status: any) {
        await new Promise(resolve => setTimeout(resolve, 200));

        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        const currentUser = this.getCurrentUser();

        if (currentUser?.role !== 'admin') {
            throw new Error('Not Admin');
        }

        const leaveIndex = leaves.findIndex((leave: any) => leave.id === leaveId);
        if (leaveIndex === -1) {
            throw new Error('Leave request not found');
        }

        leaves[leaveIndex].status = status;
        leaves[leaveIndex].approvedBy = currentUser.name;

        localStorage.setItem('leaves', JSON.stringify(leaves));

        return leaves[leaveIndex];
    }

    async getLeavesBalance() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const leaves = await this.getLeaves();
        const currentUser = this.getCurrentUser();

        const leaveBalance = {
            total: currentUser.leaveBalance.total,
            pendingRequest: leaves.filter((l: any) => l.status === 'Pending').length,
            approvedLeaves: leaves.filter((l: any) => l.status === 'Approved').length,
            availableLeaves: currentUser.leaveBalance.total - leaves.filter((l: any) => l.status === "Approved").length
        }

        const updatedUser = {
            ...currentUser,
            leaveBalance,
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        return leaveBalance;
    }
}

export default new LeaveService();