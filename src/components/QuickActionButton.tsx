import { useNavigate } from "react-router-dom"


export default function QuickActionButton({ children, link, key }: any) {
    const naviagte = useNavigate();
    return (
        <>
            <button
                key={key}
                className="px-3 py-2 bg-[#6D54B5] hover:bg-[#594694] rounded-md max-w-md w-full cursor-pointer transition-colors shadow-2xl"
                onClick={() => {
                    naviagte(`/${link}`)
                }}
            >
                {children}
            </button>
        </>
    )
}