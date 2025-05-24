import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, Box, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper as MuiPaper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import logo from "../assets/logo.png";

const Navbar = () => {
    const navigate = useNavigate();
    const [aramaMetni, setAramaMetni] = useState("");
    const [aramaSonuclari, setAramaSonuclari] = useState([]);
    const [mekanlar, setMekanlar] = useState([]);

    useEffect(() => {
        const fetchMekanlar = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "mekanlar"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMekanlar(data);
            } catch (error) {
                console.error("Mekanlar alınamadı:", error);
            }
        };
        fetchMekanlar();
    }, []);

    useEffect(() => {
        if (aramaMetni.trim() === "") {
            setAramaSonuclari([]);
            return;
        }
        const sonuc = mekanlar.filter(mekan =>
            (mekan.ad && mekan.ad.toLowerCase().includes(aramaMetni.toLowerCase())) ||
            (mekan.kategori && mekan.kategori.toLowerCase().includes(aramaMetni.toLowerCase()))
        );
        setAramaSonuclari(sonuc);
    }, [aramaMetni, mekanlar]);

    const handleSearchChange = (e) => {
        setAramaMetni(e.target.value);
    };

    const handleSelectResult = (id) => {
        navigate(`/places/${id}`);
        setAramaMetni("");
        setAramaSonuclari([]);
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#fff" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "600"
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <img src={logo} alt="logo" style={{ width: 40, height: 40 }} />
                    <Typography variant="h6" color="black" fontWeight="bold" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        AKILLI REHBER
                    </Typography>
                </Box>

                <Box display="flex" gap={3} alignItems="center" flexGrow={1} sx={{ ml: 4, fontFamily: "'Poppins', sans-serif" }}>
                    <Button onClick={() => navigate("/home")} sx={{ color: "black", fontWeight: "600" }}>🏠 Anasayfa</Button>
                    <Button onClick={() => navigate("/places")} sx={{ color: "black", fontWeight: "600" }}>📍 Yerler</Button>
                    <Button onClick={() => navigate("/assistant")} sx={{ color: "black", fontWeight: "600" }}>🤖 Tavsiye Asistanı</Button>
                    <Button onClick={() => navigate("/profile")} sx={{ color: "black", fontWeight: "600" }}>👤 Profil</Button>

                    <Box sx={{ position: "relative", width: 300 }}>
                        <TextField
                            size="small"
                            placeholder="Mekan adı veya kategori ara..."
                            value={aramaMetni}
                            onChange={handleSearchChange}
                            variant="outlined"
                            sx={{ ml: 4, bgcolor: "#f5f5f5", borderRadius: 1, width: '100%' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {aramaSonuclari.length > 0 && (
                            <MuiPaper
                                elevation={3}
                                sx={{
                                    position: "absolute",
                                    top: "40px",
                                    left: 0,
                                    right: 0,
                                    maxHeight: 250,
                                    overflowY: "auto",
                                    zIndex: 1300,
                                }}
                            >
                                <List dense disablePadding>
                                    {aramaSonuclari.map((mekan) => (
                                        <ListItem key={mekan.id} disablePadding>
                                            <ListItemButton onClick={() => handleSelectResult(mekan.id)}>
                                                <ListItemText primary={`${mekan.ad} (${mekan.kategori})`} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </MuiPaper>
                        )}
                    </Box>
                </Box>

                <Box display="flex" gap={2} alignItems="center">
                    <Button onClick={handleLogout} color="error">Çıkış Yap</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
