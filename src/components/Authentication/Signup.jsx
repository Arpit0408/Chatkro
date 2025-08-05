import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import axios from "axios";

const defaultPic = "https://cdn-icons-png.freepik.com/512/552/552909.png";

const SignupForm = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://chatkrobackend.onrender.com/api/user",
        {
          name,
          email,
          password,
          pic: defaultPic,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(response.data));

      toast.success("Signup successful");
      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        fontFamily: "sans-serif",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        gutterBottom
      >
        Sign Up
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Email"
          name="email"
          value={data.email}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={data.password}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={handleSignup}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
            mt: 1,
          }}
          fullWidth
        >
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
};

export default SignupForm;
