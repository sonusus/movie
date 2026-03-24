import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userregister.css"; 

const RegisterForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:9000/api/auth/register", form);

    if (res.data.success) {
      
      localStorage.setItem("user", JSON.stringify({
        name: form.name,
        email: form.email
      }));

      setVariant("success");
      setMessage("✅ Registration successful! Redirecting to home...");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setVariant("danger");
      setMessage(res.data.message || "Registration failed.");
    }
  } catch (err) {
    setVariant("danger");
    setMessage(err.response?.data?.message || "Server error, please try again.");
  }
};

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-transparent text-light">
      <Card className="register-card">
        <h3 className="text-center mb-4 fw-bold text-warning">🎥 Register for MovieVault</h3>
        {message && <Alert variant={variant}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100 fw-bold rounded-3">
            Register
          </Button>
        </Form>

        <p className="text-center mt-3 text-light">
          Already have an account? <a href="/userlogin" className="text-warning">Login</a>
        </p>
      </Card>
    </Container>
  );
};

export default RegisterForm;
