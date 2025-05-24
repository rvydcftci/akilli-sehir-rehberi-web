import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Divider
} from "@mui/material";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [favoriMekanlar, setFavoriMekanlar] = useState([]);
    const [gidilecekMekanlar, setGidilecekMekanlar] = useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;

            try {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setUserData(data);

                    const mekanlarSnap = await getDocs(collection(db, "mekanlar"));
                    const allMekanlar = mekanlarSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

                    const favori = allMekanlar.filter((m) =>
                        (data.favoriler || []).some(
                            fav => fav.trim().toLowerCase() === (m.ad || "").trim().toLowerCase()
                        )
                    );

                    const gidilecek = allMekanlar.filter((m) =>
                        (data.gidilecekler || []).some(
                            gid => gid.trim().toLowerCase() === (m.ad || "").trim().toLowerCase()
                        )
                    );

                    setFavoriMekanlar(favori);
                    setGidilecekMekanlar(gidilecek);
                }
            } catch (error) {
                console.error("Profil verisi alınırken hata oluştu:", error);
            }
        };

        fetchUserData();
    }, [currentUser]);

    if (!userData) return <Typography sx={{ textAlign: "center", mt: 4 }}>Yükleniyor...</Typography>;

    return (
        <Box sx={{ padding: 4 }}>
            {/* Kullanıcı Bilgisi */}
            <Box textAlign="center" mb={4}>
                <img
                    src={`/avatars/${userData?.avatar || "default"}.jpeg`}
                    alt="avatar"
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        objectFit: "cover"
                    }}
                />

                <Typography variant="h5" fontWeight="bold" mt={2}>
                    HOŞ GELDİN, {userData?.kullaniciAdi || "Kullanıcı"}
                </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Favoriler */}
            <Typography variant="h6" mb={2}>
                ❤️ Favori Mekanların
            </Typography>
            <Grid container spacing={2}>
                {favoriMekanlar.map((mekan) => (
                    <Grid item xs={12} sm={6} md={4} key={mekan.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="160"
                                image={mekan.gorselUrl}
                                alt={mekan.ad}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {mekan.ad}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {mekan.kategori} | Puan: {mekan.puan}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Gidilecekler */}
            <Typography variant="h6" mb={2}>
                ➕ Gidilecek Yerler
            </Typography>
            <Grid container spacing={2}>
                {gidilecekMekanlar.map((mekan) => (
                    <Grid item xs={12} sm={6} md={4} key={mekan.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="160"
                                image={mekan.gorselUrl}
                                alt={mekan.ad}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {mekan.ad}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {mekan.kategori} | Puan: {mekan.puan}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Profile;
