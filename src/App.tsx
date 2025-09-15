import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import LeaveService from "./services/LeaveService";
import { UserContext } from "./contexts/UserContext";
import Navbar from "./components/Navbar";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const user = LeaveService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
    setLoading(false)
  }, [])

  const handleLogin = (user: any) => {
    if (!user) {
      return;
    }
    setCurrentUser(user);
    navigate('/dashboard');
  }


  // starting loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D54B5]"></div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {currentUser && <Navbar />}
        <Outlet context={{ handleLogin }} />
    </UserContext.Provider>
  )
}

export default App
