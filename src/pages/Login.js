import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Snackbar,
    Card,
    Link,
    Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.png";

const Login = ({ onRegisterClick }) => {
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [hata, setHata] = useState("");
    const navigate = useNavigate();

    // ✨ Google Giriş Fonksiyonu
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/home");
        } catch (error) {
            setHata("Google ile giriş başarısız: " + error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, sifre);
            navigate("/home");
        } catch (error) {
            setHata("Giriş başarısız: " + error.message);
        }
    };

    return (
        <Card sx={{ p: 4, width: 370, boxShadow: 5, borderRadius: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <img src={logo} alt="logo" style={{ width: 70, height: 70, borderRadius: 10 }} />
                <Typography variant="h5" fontWeight="bold" mt={1}>
                    Akıllı Rehber
                </Typography>
            </Box>

            <form onSubmit={handleLogin}>
                <TextField
                    label="E-posta"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Şifre"
                    type={showPass ? "text" : "password"}
                    fullWidth
                    margin="normal"
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
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#ff5722" }}>
                    Giriş Yap
                </Button>
            </form>

            <Divider sx={{ my: 2 }}>veya</Divider>

            <Button
                onClick={handleGoogleLogin}
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                    textTransform: "none",
                    borderColor: "#ccc",
                    color: "#444",
                    fontWeight: "bold",
                }}
            >
                Google ile Giriş Yap
            </Button>

            <Box textAlign="center" mt={2}>
                <Link component="button" onClick={onRegisterClick} sx={{ color: "#1976d2" }}>
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
    );
};

export default Login;
