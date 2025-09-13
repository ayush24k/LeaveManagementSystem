// mock leavve service api

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
    async login(email:string, password:string) {
        
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
            const employeeUser = {
                ...INITIAL_USER,
                id: `EMP ${Math.random()}`,
                name: email.replace("@gmail.com", ''),
                email: email,
                role: 'employee'
            }
            localStorage.setItem('currentUser', JSON.stringify(employeeUser));
            return employeeUser;
        }
    };
}

export default new LeaveService();