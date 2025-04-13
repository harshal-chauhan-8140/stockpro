import { createBrowserRouter } from "react-router-dom";
import {
    Deposit,
    Home,
    Login,
    Signup,
    Stock,
    Withdraw,
    Portfolio,
    Trade,
} from "./pages/index";
import App from "./App";
import AuthLayout from "./layouts/AuthLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: (
                    <AuthLayout authentication={true}>
                        <Home />
                    </AuthLayout>
                ),
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                ),
            },
            {
                path: "/stocks",
                element: (
                    <AuthLayout authentication={true}>
                        <Stock />
                    </AuthLayout>
                ),
            },
            {
                path: "/deposit",
                element: (
                    <AuthLayout authentication={true}>
                        <Deposit />
                    </AuthLayout>
                ),
            },
            {
                path: "/withdraw",
                element: (
                    <AuthLayout authentication={true}>
                        <Withdraw />
                    </AuthLayout>
                ),
            },
            {
                path: "/portfolio",
                element: (
                    <AuthLayout authentication={true}>
                        <Portfolio />
                    </AuthLayout>
                ),
            },
            {
                path: "/trade/:symbol/:stockId",
                element: (
                    <AuthLayout authentication={true}>
                        <Trade />
                    </AuthLayout>
                ),
            },
        ],
    },
]);

export default router;