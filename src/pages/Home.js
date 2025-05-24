import React, { useEffect, useState } from "react";
import {
    Typography,
    AppBar,
    Toolbar,
    Button,
    Box,
    Container,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
    CardMedia,
    Paper,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper as MuiPaper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from '@mui/icons-material/Search';
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import restoranGorsel from "../assets/restoran.jpeg";
import assistantImage from "../assets/assistant.png";
import kafeKategoriGorsel from "../assets/kategoriler/kafe.jpeg";
import muzeKategoriGorsel from "../assets/kategoriler/muze.jpeg";
import restoranKategoriGorsel from "../assets/kategoriler/restoran.jpeg";
import tarihiyerKategoriGorsel from "../assets/kategoriler/tarihiyer.jpeg";
import { keyframes } from '@mui/system';

// Animasyon tanımları
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  } to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(1);
  } to {
    transform: scale(1.05);
  }
`;

const Home = () => {
    const [isim, setIsim] = useState("");
    const [loading, setLoading] = useState(true);
    const [mekanlar, setMekanlar] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [aramaMetni, setAramaMetni] = useState("");
    const [aramaSonuclari, setAramaSonuclari] = useState([]);
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
                setIsim(docSnap.exists() ? docSnap.data().isim : "Kullanıcı");
            } catch (error) {
                console.error("Kullanıcı verisi alınamadı:", error);
                setIsim("Kullanıcı");
            } finally {
                setLoading(false);
            }
        };

        const fetchMekanlar = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "mekanlar"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMekanlar(data);
            } catch (error) {
                console.error("Mekanlar alınamadı:", error);
            }
        };

        fetchUserData();
        fetchMekanlar();
    }, [navigate]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    const handleNotifOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotifClose = () => {
        setAnchorEl(null);
    };

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Hero */}
            <Box
                sx={{
                    backgroundColor: "#000",
                    py: 10,
                    px: 2,
                }}
            >
                <Container>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 4,
                            color: "white",
                        }}
                    >
                        {/* Görsel */}
                        <Box
                            sx={{
                                flex: 1,
                                maxWidth: { xs: "100%", md: 450 },
                                animation: `${fadeInUp} 1s ease forwards`,
                            }}
                        >
                            <Box
                                component="img"
                                src={restoranGorsel}
                                alt="Restoran Görseli"
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                                    width: "100%",
                                    objectFit: "cover",
                                    animation: `${zoomIn} 4s ease-in-out infinite alternate`,
                                }}
                            />
                        </Box>

                        {/* Yazılar */}
                        <Box
                            sx={{
                                flex: 1,
                                maxWidth: 600,
                                animation: `${fadeInUp} 1s ease forwards`,
                                animationDelay: "0.5s",
                                opacity: 0,
                            }}
                        >
                            <Typography
                                variant="h2"
                                fontWeight="700"
                                sx={{
                                    textTransform: "uppercase",
                                    fontSize: { xs: '2.5rem', md: '3rem' },
                                    lineHeight: 1.2,
                                    color: "#fff",
                                    mb: 3,
                                    fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                AKILLI ŞEHİR REHBERİNE HOŞ GELDİNİZ
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                                    lineHeight: 1.6,
                                    color: "#e0e0e0",
                                    maxWidth: 600,
                                    textAlign: "left",
                                    fontFamily: "'Open Sans', sans-serif",
                                }}
                            >
                                Şehrindeki her köşe, keşfedilmeyi bekleyen eşsiz hikayelerle dolu.
                                Gizli kalmış güzelliklerden popüler mekanlara kadar şehrin tüm renklerini keşfet,
                                yorumlarını paylaş ve şehrini yeni bir gözle keşfetmenin tadını çıkar.
                                En seçkin kafeler, restoranlar, müzeler ve tarihi mekanlar tek bir rehberde bir araya geliyor.
                                Güncel önerilerle, kolay erişim imkanı sayesinde şehirdeki en iyi deneyimleri yaşamak artık çok daha kolay!
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/places")}
                                    sx={{
                                        backgroundColor: "white",
                                        color: "black",
                                        fontWeight: "bold",
                                        py: 1.8,
                                        px: 5,
                                        borderRadius: 2,
                                        fontSize: { xs: '1rem', md: '1.2rem' },
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            boxShadow: "0 4px 15px rgba(25, 118, 210, 0.6)",
                                        },
                                    }}
                                >
                                    KEŞFET
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>
            {/* Öne Çıkan Mekanlar */}
            <Container sx={{ mt: 8 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                    ÖNE ÇIKAN YERLER🏙️
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    {mekanlar.slice(0, 3).map((mekan) => (
                        <Grid item xs={12} sm={6} md={4} key={mekan.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Card
                                sx={{
                                    width: 220,
                                    height: 220,
                                    borderRadius: 3,
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                    transition: "transform 0.3s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                                    }
                                }}
                            >
                                {mekan.gorselUrl && (
                                    <CardMedia
                                        component="img"
                                        height="120"
                                        image={mekan.gorselUrl}
                                        alt={mekan.ad}
                                        sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1, p: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                        🏙️ {mekan.ad}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        {mekan.aciklama}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                        Puan: {mekan.puan}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Kullanıcı Yorumları Bölümü */}
            <Box sx={{ py: 8, backgroundColor: "#fafafa" }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        ZİYARETÇİLER NE DİYOR?💬
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            overflowX: "auto",
                            gap: 3,
                            paddingBottom: 2,
                        }}
                    >
                        {[
                            {
                                ad: "Elif Y.👩",
                                yorum: "Harput Kalesi gerçekten büyüleyiciydi! Elazığ’da mutlaka görülmesi gereken bir yer.",
                                tarih: "Mart 2025",
                                mekan: "Harput Kalesi",
                                emoji: "📍",
                                puan: 4.8,
                                katkilar: 2,
                            },
                            {
                                ad: "Mert K.👨",
                                yorum: "Müzenin Kahvesi çok keyifliydi. Hem kahve içip hem tarihi atmosferi yaşadım.",
                                tarih: "Nisan 2025",
                                mekan: "Müzenin Kahvesi",
                                emoji: "☕",
                                puan: 4.5,
                                katkilar: 17,
                            },
                            {
                                ad: "Zeynep A.👩‍🦳",
                                yorum: "Ensar Mangal Vadisi kalabalıktı ama lezzetliydi. Rezervasyon yapmanız şart.",
                                tarih: "Mayıs 2025",
                                mekan: "Ensar Mangal Vadisi",
                                emoji: "🔥",
                                puan: 4.2,
                                katkilar: 138,
                            },
                        ].map((yorum, index) => (
                            <Paper
                                key={index}
                                elevation={3}
                                sx={{
                                    minWidth: 280,
                                    minHeight: 280,
                                    flexShrink: 0,
                                    borderRadius: 2,
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    textAlign: "left",
                                    boxSizing: "border-box",
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {yorum.ad}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    {yorum.emoji} {yorum.mekan} • {yorum.tarih} • {yorum.katkilar} katkı
                                </Typography>
                                <Box sx={{ mb: 1 }}>
                                    {/* Yıldız puan gösterimi basit: */}
                                    {"⭐".repeat(Math.floor(yorum.puan))}
                                    {yorum.puan % 1 >= 0.5 ? "⭐️" : ""}
                                    {"☆".repeat(5 - Math.ceil(yorum.puan))}
                                    <Typography variant="caption" sx={{ ml: 1 }}>
                                        ({yorum.puan})
                                    </Typography>
                                </Box>
                                <Typography variant="body1" fontStyle="italic" sx={{ flexGrow: 1 }}>
                                    “{yorum.yorum}”
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Tavsiye Asistanı Tanıtımı */}
            <Box
                sx={{
                    background: "linear-gradient(to right, #e0f7fa, #e0f7fa)", // Sağ taraf beyaz değil mavi oldu
                    py: 8,
                    mt: 10,
                    width: "100vw",
                    boxSizing: "border-box",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Yapay Zekâ Destekli Tavsiye Asistanı
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Size özel restoran, kafe, müze önerileri almak ister misiniz?
                            </Typography>
                            <Button
                                onClick={() => navigate("/assistant")}
                                variant="contained"
                                sx={{ backgroundColor: "#1976d2" }}
                            >
                                Asistanı Aç
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: { xs: "center", md: "right" } }}>
                            <Box
                                component="img"
                                src={assistantImage}
                                alt="AI Assistant"
                                sx={{ width: "100%", maxWidth: 400, height: "auto", borderRadius: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Kategoriler */}
            <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        KATEGORİLERE GÖZ AT👇🏻
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {[
                            { ad: "Müze", gorsel: muzeKategoriGorsel, kategori: "müze" },
                            { ad: "Restoran", gorsel: restoranKategoriGorsel, kategori: "restoran" },
                            { ad: "Kafe", gorsel: kafeKategoriGorsel, kategori: "kafe" },
                            { ad: "Tarihi Yer", gorsel: tarihiyerKategoriGorsel, kategori: "tarihi" }
                        ].map((item, i) => (
                            <Grid item xs={6} sm={4} md={3} key={i} sx={{ display: "flex", justifyContent: "center" }}>
                                <Box
                                    onClick={() => navigate(`/places?kategori=${item.kategori}`)}
                                    sx={{
                                        position: "relative",
                                        width: 200,
                                        height: 200,
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow: 3,
                                        cursor: "pointer",
                                        transition: "transform 0.3s",
                                        "&:hover": {
                                            transform: "scale(1.03)"
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.gorsel}
                                        alt={item.ad}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            width: "100%",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            color: "#fff",
                                            textAlign: "center",
                                            py: 1,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {item.ad}
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>


            {/* Footer */}
            <Box sx={{ backgroundColor: "#f5f5f5", py: 6, mt: 10 }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6">🏙️ Akıllı Şehir Rehberi</Typography>
                            <Typography variant="body2">Şehrindeki en iyi mekanları keşfet, yorum yap ve favorilerine ekle.</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6">🧭 Keşfet</Typography>
                            <Typography>☕ Kafeler</Typography>
                            <Typography>🍽️ Restoranlar</Typography>
                            <Typography>🏛️ Müzeler</Typography>
                            <Typography>🏰 Tarihi Yerler</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6">❓ Yardım</Typography>
                            <Typography>ℹ️ Hakkımızda</Typography>
                            <Typography>📞 İletişim</Typography>
                            <Typography>🔒 Gizlilik Politikası</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6">📬 İletişim</Typography>
                            <Typography>📧 akillirehber@gmail.com</Typography>
                            <Typography>📱 0542 128 18 99</Typography>
                            <Typography>📍 Türkiye</Typography>
                            <Typography>📸 Instagram: @akillisehirrehberi</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" align="center" sx={{ mt: 4, color: "text.secondary" }}>
                        © 2025 Akıllı Şehir Rehberi | Tüm Hakları Saklıdır.
                    </Typography>
                </Container>
            </Box>
        </>
    );
};

export default Home;
