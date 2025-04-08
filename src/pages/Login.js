import logo from '../assets/logo.png';

import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Card,
    IconButton,
    InputAdornment,
    Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [hata, setHata] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, sifre);
            navigate("/home"); // Giriş başarılıysa yönlendirme
        } catch (error) {
            setHata("Giriş başarısız: " + error.message);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                backgroundColor: "#121212", // ✅ sadece bu yeterli
            }}
        >

            <Card
                sx={{
                    p: 4,
                    width: 370,
                    boxShadow: 5,
                    borderRadius: 3,
                    backgroundColor: "white",
                }}
            >
                {/* ✅ LOGO + UYGULAMA ADI */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <img
                        src={logo}
                        alt="Akıllı Rehber Logo"
                        style={{ width: 70, height: 70, borderRadius: 10 }}
                    />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                        Akıllı Rehber
                    </Typography>
                </Box>

                <form onSubmit={handleLogin}>
                    <TextField
                        label="E-posta"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Şifre"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPass ? "text" : "password"}
                        value={sifre}
                        onChange={(e) => setSifre(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                        {showPass ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: "#ff5722" }}
                    >
                        Giriş Yap
                    </Button>
                </form>

                <Box textAlign="center" mt={2}>
                    <Link href="/register" underline="hover" sx={{ color: "#1976d2", fontWeight: 500 }}>
                        Hesabınız yok mu? Kayıt Ol
                    </Link>
                </Box>

                <Snackbar
                    open={!!hata}
                    onClose={() => setHata("")}
                    message={hata}
                    autoHideDuration={4000}
                />
            </Card>
        </Box>
    );
};

export default Login;
