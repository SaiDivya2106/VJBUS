import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setApplicationsData, setError } from '../slices/ApplicationSlice';

function Header() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch("http://campus.vnrzone.site/sa-be/public/get-all-applications");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    dispatch(setApplicationsData(data.data));
                } else {
                    dispatch(setError("Failed to load Applications."));
                }
            } catch (error) {
                console.error("Error fetching Applications:", error.message);
                dispatch(setError("Failed to load Applications."));
            }
        };

        fetchApplications();
    }, [dispatch]);

    return <div></div>;
}

export default Header;
