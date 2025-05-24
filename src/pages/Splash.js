// src/pages/Splash.js
import React, { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import Login from './Login';
import Register from './Register';

const Splash = () => {
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);

    const handleOpenLogin = () => {
        setOpenLogin(true);
        setOpenRegister(false);
    };

    const handleOpenRegister = () => {
        setOpenRegister(true);
        setOpenLogin(false);
    };

    const handleClose = () => {
        setOpenLogin(false);
        setOpenRegister(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url("/assets/akilli-sehir-kolaj.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}
        >
            <Typography
                variant="h2"
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    px: 3,
                    py: 1,
                    fontWeight: 'bold',
                    borderRadius: 2,
                }}
            >
                AKILLI
            </Typography>

            <Typography
                variant="h3"
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    px: 3,
                    py: 1,
                    fontWeight: 'bold',
                    mt: 2,
                    borderRadius: 2,
                }}
            >
                ŞEHİR REHBERİ
            </Typography>

            <Button
                variant="contained"
                onClick={handleOpenLogin}
                sx={{
                    mt: 4,
                    backgroundColor: 'black',
                    color: 'white',
                    px: 4,
                    py: 1,
                    '&:hover': {
                        backgroundColor: 'gray',
                    },
                }}
            >
                GİRİŞ YAP
            </Button>

            {/* Login Modal */}
            <Modal open={openLogin} onClose={handleClose}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Login onRegisterClick={handleOpenRegister} />
                </Box>
            </Modal>

            {/* Register Modal */}
            <Modal open={openRegister} onClose={handleClose}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Register onLoginRedirect={handleOpenLogin} />
                </Box>
            </Modal>
        </Box>
    );
};

export default Splash;
