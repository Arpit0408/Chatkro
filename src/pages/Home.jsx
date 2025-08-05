import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chat");
  }, [navigate]);

  return (
    <Box
  sx={{
    minHeight: "100vh",
    width: "100%", // use full viewport width instead of 100%
    overflowX: "hidden", // optional, to prevent scroll from any side padding/margin
    m: 0,
    p: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }} style={{padding:'0px'}}
>
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.3)",
          }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            align="center"
            fontWeight="bold"
            gutterBottom
            color="white"
            sx={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            Chatkro
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
            <Button
              variant={isLogin ? "contained" : "outlined"}
              color="primary"
              fullWidth
              onClick={() => setIsLogin(true)}
              sx={{
                boxShadow: isLogin ? 4 : "none",
              }}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "contained" : "outlined"}
              color="primary"
              fullWidth
              onClick={() => setIsLogin(false)}
              sx={{
                boxShadow: !isLogin ? 4 : "none",
              }}
            >
              Sign Up
            </Button>
          </Stack>

          <Box mt={2}>{isLogin ? <Login /> : <Signup />}</Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Homepage;
