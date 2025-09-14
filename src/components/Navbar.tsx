import { Link, useNavigate } from "react-router-dom";
import { getUserContext } from "../contexts/UserContext";
import LeaveService from "../services/LeaveService";

export default function Navbar() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = getUserContext();


    const handleLogout =  async() => {
        try {
             LeaveService.logout();
             setCurrentUser(null);
             navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <div>nav <Link to={'/applyLeave'}>ApplyLeave</Link></div>
            <p>{currentUser?.name}</p>
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}