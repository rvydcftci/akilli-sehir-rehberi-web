import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Card,
    Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import logo from "../assets/logo.png"; // 🔹 Logon burada

const Register = () => {
    const [isim, setIsim] = useState("");
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [hata, setHata] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
            const uid = userCredential.user.uid;

            // Firestore'a isim ve e-posta kaydı
            await setDoc(doc(db, "users", uid), {
                isim: isim,
                email: email,
            });

            navigate("/login");
        } catch (error) {
            setHata("Kayıt başarısız: " + error.message);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                backgroundColor: "#121212", // siyah ton,
            }}
        >
            <Card sx={{ p: 4, width: 370, boxShadow: 5, borderRadius: 3, backgroundColor: "white" }}>
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

                <form onSubmit={handleRegister}>
                    <TextField
                        label="İsim"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={isim}
                        onChange={(e) => setIsim(e.target.value)}
                    />

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
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sifre}
                        onChange={(e) => setSifre(e.target.value)}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: "#ff5722" }}
                    >
                        Kayıt Ol
                    </Button>
                </form>

                <Box textAlign="center" mt={2}>
                    <Link href="/login" underline="hover" sx={{ color: "#1976d2", fontWeight: 500 }}>
                        Zaten hesabın var mı? Giriş yap
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

export default Register;
