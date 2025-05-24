// src/pages/PlaceDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Kullanıcı bilgisini almak için eklendi
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Rating,
    Divider,
    Grid,
    TextField,
    Button
} from "@mui/material";

const getKategoriEmoji = (kategori) => {
    switch (kategori) {
        case "kafe":
            return "☕";
        case "restoran":
            return "🍽️";
        case "müze":
            return "🏛️";
        case "tarihi":
            return "🏰";
        default:
            return "📍";
    }
};

const formatDate = (timestamp) => {
    const date = timestamp?.toDate?.();
    return date ? date.toLocaleDateString("tr-TR") : "";
};

const PlaceDetail = () => {
    const { id } = useParams();
    const [mekan, setMekan] = useState(null);
    const [loading, setLoading] = useState(true);

    // Yeni eklenen yorum için state
    const [yorumMetni, setYorumMetni] = useState("");
    const [yorumPuan, setYorumPuan] = useState(0);
    const [yorumGonderiliyor, setYorumGonderiliyor] = useState(false);
    const [yorumHata, setYorumHata] = useState("");

    useEffect(() => {
        const fetchPlace = async () => {
            const docRef = doc(db, "mekanlar", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setMekan(docSnap.data());
            }
            setLoading(false);
        };
        fetchPlace();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!mekan) {
        return <Typography align="center">Mekan bulunamadı</Typography>;
    }

    // Yorum gönderme fonksiyonu (kullanıcı adı Firebase Auth'tan alınıyor)
    const handleYorumGonder = async () => {
        if (yorumMetni.trim() === "" || yorumPuan === 0) {
            setYorumHata("Lütfen yorum metni ve puan giriniz.");
            return;
        }

        setYorumGonderiliyor(true);
        setYorumHata("");

        try {
            const user = getAuth().currentUser;
            const kullaniciAdi = user ? user.email.split("@")[0] : "Anonim"; // Kullanıcı adı eposta'nın @ öncesi veya Anonim

            const docRef = doc(db, "mekanlar", id);
            const yeniYorum = {
                kullaniciAdi,
                yorumMetni: yorumMetni.trim(),
                puan: yorumPuan,
                tarih: Timestamp.fromDate(new Date())
            };

            // Firestore'da yorumlar array'ine ekle
            await updateDoc(docRef, {
                yorumlar: arrayUnion(yeniYorum)
            });

            // Yorumlar güncellendiği için lokal state'i de güncelleyelim
            setMekan(prev => ({
                ...prev,
                yorumlar: prev.yorumlar ? [...prev.yorumlar, yeniYorum] : [yeniYorum]
            }));

            // Formu sıfırla
            setYorumMetni("");
            setYorumPuan(0);
        } catch (error) {
            setYorumHata("Yorum gönderilirken hata oluştu. Lütfen tekrar deneyin.");
            console.error(error);
        } finally {
            setYorumGonderiliyor(false);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {getKategoriEmoji(mekan.kategori)} {mekan.ad}
            </Typography>

            <img
                src={mekan.gorselUrl}
                alt={mekan.ad}
                style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 10 }}
            />

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" gutterBottom>
                        {mekan.aciklama}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        🕒 {mekan.acilisSaati} - {mekan.kapanisSaati}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        💸 Ortalama Fiyat: {mekan.ortalamaFiyat}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Rating value={mekan.puan} precision={0.1} readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {mekan.puan} / 5
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        📍 Konum: {mekan.konum?.latitude?.toFixed(4)}, {mekan.konum?.longitude?.toFixed(4)}
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Yorumlar */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Yorumlar
            </Typography>
            {mekan.yorumlar?.length > 0 ? (
                mekan.yorumlar.map((yorum, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">{yorum.kullaniciAdi}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            "{yorum.yorumMetni}"
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ⭐ {yorum.puan} - {formatDate(yorum.tarih)}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                    Henüz yorum yok.
                </Typography>
            )}

            {/* Yorum ekleme formu */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Yeni Yorum Ekle
                </Typography>
                {yorumHata && (
                    <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                        {yorumHata}
                    </Typography>
                )}
                <Rating
                    name="yorum-puan"
                    value={yorumPuan}
                    onChange={(event, newValue) => setYorumPuan(newValue)}
                />
                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    label="Yorumunuz"
                    value={yorumMetni}
                    onChange={(e) => setYorumMetni(e.target.value)}
                    sx={{ mt: 1, mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    disabled={yorumGonderiliyor}
                    onClick={handleYorumGonder}
                >
                    {yorumGonderiliyor ? "Gönderiliyor..." : "Yorumu Gönder"}
                </Button>
            </Box>
        </Container>
    );
};

export default PlaceDetail;
