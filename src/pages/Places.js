import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Container,
    CircularProgress,
    CardMedia,
    CardActionArea,
    Box,
    Rating,
    IconButton,
    Chip,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const getKategoriEmoji = (kategori = '') => {
    switch (kategori.toLowerCase()) {
        case 'kafe': return '☕';
        case 'restoran': return '🍽️';
        case 'müze': return '🏛️';
        case 'tarihi yer': return '🏰';
        default: return '📍';
    }
};

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Places = () => {
    const [mekanlar, setMekanlar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedKategori, setSelectedKategori] = useState('');
    const [selectedFiyat, setSelectedFiyat] = useState('');
    const [favoriler, setFavoriler] = useState([]);

    const navigate = useNavigate();
    const user = getAuth().currentUser;

    useEffect(() => {
        // Kullanıcının favorilerini yükle
        const fetchFavoriler = async () => {
            if (!user) return;
            try {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setFavoriler(userData.favoriler || []);
                }
            } catch (error) {
                console.error("Favoriler alınamadı:", error);
            }
        };
        fetchFavoriler();
    }, [user]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const handleAddToList = async (placeName, type) => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const list = userData[type] || [];

        let newMessage = '';

        if (list.includes(placeName)) {
            await updateDoc(userRef, {
                [type]: arrayRemove(placeName)
            });
            newMessage = type === 'favoriler' ? 'Favorilerden çıkarıldı' : 'Gidileceklerden çıkarıldı';

            if (type === 'favoriler') {
                setFavoriler(prev => prev.filter(ad => ad !== placeName));
            }
        } else {
            await updateDoc(userRef, {
                [type]: arrayUnion(placeName)
            });
            newMessage = type === 'favoriler' ? 'Favorilere eklendi' : 'Gidileceklere eklendi';

            if (type === 'favoriler') {
                setFavoriler(prev => [...prev, placeName]);
            }
        }

        setSnackbarMessage(newMessage);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    useEffect(() => {
        const fetchMekanlar = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'mekanlar'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMekanlar(data);
            } catch (error) {
                console.error("Mekanlar alınırken hata oluştu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMekanlar();
    }, []);

    const filteredMekanlar = mekanlar.filter(mekan => {
        if (selectedKategori && mekan.kategori?.toLowerCase() !== selectedKategori.toLowerCase()) {
            return false;
        }
        if (selectedFiyat) {
            const fiyat = Number(String(mekan.ortalamaFiyat).replace(/[^\d.-]/g, ""));
            switch (selectedFiyat) {
                case "0-100":
                    if (!(fiyat >= 0 && fiyat <= 100)) return false;
                    break;
                case "100-200":
                    if (!(fiyat > 100 && fiyat <= 200)) return false;
                    break;
                case "200-300":
                    if (!(fiyat > 200 && fiyat <= 300)) return false;
                    break;
                case "300-400":
                    if (!(fiyat > 300 && fiyat <= 400)) return false;
                    break;
                case "400-500":
                    if (!(fiyat > 400 && fiyat <= 500)) return false;
                    break;
                case "500+":
                    if (!(fiyat > 500)) return false;
                    break;
                default:
                    break;
            }
        }
        return true;
    });

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container
            sx={{
                paddingTop: 6,
                paddingBottom: 6,
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                backgroundColor: '#f0f4f8',
                backgroundRepeat: 'repeat',
                borderRadius: 3
            }}
        >
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    fontFamily: '"Playfair Display", serif',
                    letterSpacing: 1
                }}
            >
                📍 YERLER
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                        value={selectedKategori}
                        label="Kategori"
                        onChange={(e) => setSelectedKategori(e.target.value)}
                    >
                        <MenuItem value="">Tümü</MenuItem>
                        <MenuItem value="kafe">Kafe</MenuItem>
                        <MenuItem value="restoran">Restoran</MenuItem>
                        <MenuItem value="müze">Müze</MenuItem>
                        <MenuItem value="tarihi yer">Tarihi Yer</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Ortalama Fiyat</InputLabel>
                    <Select
                        value={selectedFiyat}
                        label="Ortalama Fiyat"
                        onChange={(e) => setSelectedFiyat(e.target.value)}
                    >
                        <MenuItem value="">Tümü</MenuItem>
                        <MenuItem value="0-100">0 - 100 ₺</MenuItem>
                        <MenuItem value="100-200">100 - 200 ₺</MenuItem>
                        <MenuItem value="200-300">200 - 300 ₺</MenuItem>
                        <MenuItem value="300-400">300 - 400 ₺</MenuItem>
                        <MenuItem value="400-500">400 - 500 ₺</MenuItem>
                        <MenuItem value="500+">500 ₺ ve üzeri</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {filteredMekanlar.map(mekan => {
                    const isFavori = favoriler.includes(mekan.ad);
                    return (
                        <Grid item xs={12} sm={6} md={6} key={mekan.id}>
                            <Card
                                sx={{
                                    height: 360,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                                    },
                                    position: 'relative',
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                <CardActionArea onClick={() => navigate(`/places/${mekan.id}`)}>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={mekan.gorselUrl || "https://via.placeholder.com/400x160?text=Mekan+Gorseli"}
                                        alt={mekan.ad}
                                        sx={{ transition: 'transform 0.3s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}
                                    />
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6" fontWeight="bold">
                                                {getKategoriEmoji(mekan.kategori)} {mekan.ad}
                                            </Typography>
                                            <Chip
                                                label={mekan.kategori ? mekan.kategori.toUpperCase() : "GENEL"}
                                                size="small"
                                                color="primary"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Rating value={mekan.puan} precision={0.1} readOnly size="small" />
                                            <Typography variant="body2" sx={{ ml: 1 }}>
                                                {mekan.puan} / 5
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        color={isFavori ? "error" : "default"}
                                        onClick={() => handleAddToList(mekan.ad, "favoriler")}
                                    >
                                        {isFavori ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                    <IconButton size="small" color="primary" onClick={() => handleAddToList(mekan.ad, "gidilecekler")}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Container>
    );
};

export default Places;
