export const INITIAL_USER = {
  id: '1',
  name: 'Ayush',
  email: 'ayush@gmail.com',
  role: 'employee', // 'employee' or 'admin'
  leaveBalance: {
    pendingRequest: null,
    availableLeaves: null,
    approvedLeaves: null,
    total: 20
  }
};