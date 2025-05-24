import React, { useState } from "react";
import {
    Box, Button, TextField, Typography, Snackbar, Card, Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import logo from "../assets/logo.png";

const Register = ({ onLoginRedirect }) => {
    const [kullaniciAdi, setKullaniciAdi] = useState("");
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("avatar1");
    const [hata, setHata] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                kullaniciAdi,
                email,
                avatar: selectedAvatar,
                favoriler: [],
                gidilecekler: []
            });


            onLoginRedirect(); // kayıt başarılıysa login modalına dön
        } catch (error) {
            setHata("Kayıt başarısız: " + error.message);
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

            <form onSubmit={handleRegister}>
                <TextField
                    label="Kullanıcı Adı"
                    fullWidth
                    margin="normal"
                    value={kullaniciAdi}
                    onChange={(e) => setKullaniciAdi(e.target.value)}
                />
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
                    type="password"
                    fullWidth
                    margin="normal"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                />
                <Typography variant="subtitle1" mt={2}>
                    Avatarını Seç:
                </Typography>
                <Box display="flex" gap={2} justifyContent="center" mt={1}>
                    {["avatar1", "avatar2", "avatar3", "avatar4"].map((avatar) => (
                        <img
                            key={avatar}
                            src={`/avatars/${avatar}.jpeg`}
                            alt={avatar}
                            onClick={() => setSelectedAvatar(avatar)}
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: "50%",
                                border: selectedAvatar === avatar ? "3px solid #1976d2" : "2px solid #ccc",
                                cursor: "pointer",
                                transition: "0.2s"
                            }}
                        />
                    ))}
                </Box>

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#ff5722" }}>
                    Kayıt Ol
                </Button>
            </form>

            <Box textAlign="center" mt={2}>
                <Link component="button" onClick={onLoginRedirect} sx={{ color: "#1976d2" }}>
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
    );
};

export default Register;
