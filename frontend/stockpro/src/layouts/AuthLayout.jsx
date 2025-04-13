import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../app/userSlice";

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(true);
    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.user.accessToken);

    useEffect(() => {
        (() => {
            if (!user || !token) {
                const localUser = localStorage.getItem("user");

                if (localUser) {
                    try {
                        const parsed = JSON.parse(localUser);

                        if (parsed?.user && parsed?.accessToken) {
                            dispatch(login(parsed));
                            console.log("Auth restored from localStorage");
                        } else {
                            console.warn("Invalid auth data in localStorage");
                        }
                    } catch (err) {
                        console.error("Failed to parse auth from localStorage", err);
                    }
                }
            }
        })();

        setLoader(false);
    }, [user, token, dispatch]);

    useEffect(() => {
        if (!loader) {
            if (authentication && !token) navigate("/login");

            if (!authentication && token) navigate("/");
        }
    }, [loader, token, authentication, navigate]);

    if (loader) return <h1 className="text-center mt-10">Loading...</h1>;

    return <>{children}</>;
}
