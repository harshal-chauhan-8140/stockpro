import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/userSlice";
import toast from "react-hot-toast";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const token = useSelector((state) => state.user?.accessToken);
    const isLoggedIn = Boolean(token);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const navItems = [
        !isLoggedIn && { name: "Login", slug: "/login" },
        !isLoggedIn && { name: "Signup", slug: "/signup" },
        isLoggedIn && { name: "Stocks", slug: "/stocks" },
        isLoggedIn && { name: "Deposit", slug: "/deposit" },
        isLoggedIn && { name: "Withdraw", slug: "/withdraw" },
        isLoggedIn && { name: "Portfolio", slug: "/portfolio" },
    ].filter(Boolean);

    return (
        <header>
            <nav className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/stocks")}>
                    <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto" />
                    <span className="text-xl font-semibold text-blue-600">StockPro</span>
                </div>

                <ul className="flex items-center gap-x-6">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.slug;
                        return (
                            <li
                                key={index}
                                className={`cursor-pointer text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-700"
                                    } hover:text-blue-500 transition`}
                                onClick={() => navigate(item.slug)}
                            >
                                {item.name}
                            </li>
                        );
                    })}

                    {isLoggedIn && (
                        <li
                            className="cursor-pointer text-sm text-gray-700 hover:text-red-600 transition font-medium"
                            onClick={handleLogout}
                        >
                            Logout
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}