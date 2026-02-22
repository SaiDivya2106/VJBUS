import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";

const RoleSwitcher = () => {
    const { switchRole, isExperimental } = useAuth();
    const [currentRole, setCurrentRole] = useState(localStorage.getItem("demoRole") || "student");

    if (!isExperimental) return null;

    const handleSwitch = (role) => {
        setCurrentRole(role);
        switchRole(role);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#3b7abeff',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            fontSize: '12px',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' }}>
                🧪 EXPERIMENTAL MODE
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    onClick={() => handleSwitch('student')}
                    style={{
                        backgroundColor: currentRole === 'student' ? '#fff' : 'transparent',
                        color: currentRole === 'student' ? '#3b7abeff' : '#fff',
                        border: '1px solid #fff',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer'
                    }}
                >
                    Student
                </button>
                <button
                    onClick={() => handleSwitch('admin')}
                    style={{
                        backgroundColor: currentRole === 'admin' ? '#fff' : 'transparent',
                        color: currentRole === 'admin' ? '#3b7abeff' : '#fff',
                        border: '1px solid #fff',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer'
                    }}
                >
                    Admin
                </button>
                <button
                    onClick={() => handleSwitch('superadmin')}
                    style={{
                        backgroundColor: currentRole === 'superadmin' ? '#fff' : 'transparent',
                        color: currentRole === 'superadmin' ? '#3b7abeff' : '#fff',
                        border: '1px solid #fff',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer'
                    }}
                >
                    Super
                </button>
            </div>
            <div style={{ fontSize: '10px', marginTop: '4px', textAlign: 'center', opacity: 0.8 }}>
                Data resets weekly
            </div>
        </div>
    );
};

export default RoleSwitcher;
