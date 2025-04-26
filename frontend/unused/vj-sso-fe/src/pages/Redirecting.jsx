import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Redirecting = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/";

    useEffect(() => {
        navigate(redirectUrl);
    }, [navigate, redirectUrl]);

    return <p>Redirecting...</p>;
};

export default Redirecting;