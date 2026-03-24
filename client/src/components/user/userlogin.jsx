import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userlogin.css";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:9000/api/auth/login", form);

    if (res.data.success) {
     
      localStorage.setItem("user", JSON.stringify({
        name: res.data.user.name,
        email: res.data.user.email
      }));

      setVariant("success");
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/trendingmovies"), 1500);
    } else {
      setVariant("danger");
      setMessage(res.data.message);
    }
  } catch (err) {
    setVariant("danger");
    setMessage(err.response?.data?.message || "Server error.");
  }
};

  return (
    <div className="login-bg text-light">
      <Container>
        <Card className="login-card mx-auto p-4 text-light">
          <h2 className="text-center mb-2 fw-bold text-warning">MovieVault</h2>
          <p className="text-center text-secondary mb-4">
            Welcome back! Sign in to continue 🎬
          </p>

          {message && <Alert variant={variant}>{message}</Alert>}

          <Form onSubmit={handleSubmit}>
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

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 fw-bold rounded-3 py-2 glow-btn">
              Login
            </Button>
          </Form>

          <p className="text-center mt-3 text-light">
            Don’t have an account?{" "}
            <a href="/userreg" className="text-warning">
              Register
            </a>
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default LoginForm;
