import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // 🔹 logoyu ekliyoruz

const Home = () => {
    const [isim, setIsim] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setIsim(docSnap.data().isim);
                } else {
                    setIsim("Kullanıcı");
                }
            } catch (error) {
                console.error("Kullanıcı verisi alınamadı:", error);
                setIsim("Kullanıcı");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{
                background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
            }}
        >
            <img
                src={logo}
                alt="Akıllı Rehber Logo"
                style={{ width: 80, height: 80, borderRadius: 10, marginBottom: 16 }}
            />

            <Typography
                variant="h4"
                fontWeight="bold"
                color="white"
                textAlign="center"
            >
                Hoş geldin, {isim} 👋
            </Typography>
        </Box>
    );
};

export default Home;
