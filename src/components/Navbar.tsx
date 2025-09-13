import { Link } from "react-router-dom";
import { getUserContext } from "../contexts/UserContext";

export default function Navbar() {
    const { currentUser } = getUserContext();
    return (
        <div>
            <div>nav <Link to={'/applyLeave'}>ApplyLeave</Link></div>
            <p>{currentUser.name}</p>
        </div>
    )
}