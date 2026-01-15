// components/AuthPage.js
import React, { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import Login_component from "../assets/components/Login_component";

const LogInPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (formData, isLoginMode) => {
    if (isLoginMode) {
      // Handle login logic
      console.log("Login attempt:", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      // Handle signup logic
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log("Signup attempt:", formData);
    }
  };

  const handleToggleMode = (loginMode) => {
    setIsLogin(loginMode);
  };

  return (
    <AuthLayout isLogin={isLogin}>
      <Login_component />
    </AuthLayout>
  );
};

export default LogInPage;
