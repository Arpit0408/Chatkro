import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = data;
    if (!email || !password) {
      toast.error("Enter login credentials");
      return;
    }

    try {
      const response = await axios.post("https://chatkrobackend.onrender.com/api/user/login", {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      toast.success("Login successful");
      navigate("/chat");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Email"
        variant="outlined"
        name="email"
        value={data.email}
        onChange={handleChange}
        fullWidth
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "none",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        name="password"
        value={data.password}
        onChange={handleChange}
        fullWidth
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "white" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "none",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        Login
      </Button>
    </Stack>
  );
};

export default LoginForm;
