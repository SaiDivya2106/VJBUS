import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import './manage-assistants.css';

const ManageAssistants = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

    const handleAddAssistant = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`${baseUrl}/admin-api/add-assistant`, {
                email,
                name
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Assistant ${name} added successfully!`);
            setEmail("");
            setName("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add assistant");
        }
    };

    return (
        <div className="container mt-4">
            <Card className="p-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 className="mb-4 text-center">Manage Assistants</h3>

                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleAddAssistant}>
                    <Form.Group className="mb-3">
                        <Form.Label>Assistant Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Assistant Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Add Assistant
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ManageAssistants;
