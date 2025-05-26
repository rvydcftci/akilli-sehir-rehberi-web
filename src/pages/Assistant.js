// Assistant v2: Hatalar giderildi, fiyat-parsing, konum filtresi, kategori uyumu şle geliştirildi
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Assistant = () => {
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [konum, setKonum] = useState(null);
    const [sonKategori, setSonKategori] = useState(null);
    const [sonFiyat, setSonFiyat] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("Konum alındı:", pos.coords);
                setKonum({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => console.warn("Konum alınamadı:", err),
            { enableHighAccuracy: true }
        );
    }, []);


    const getKategori = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes("kafe") || lower.includes("kahve") || lower.includes("çay")) return "kafe";
        if (lower.includes("restoran") || lower.includes("yemek") || lower.includes("doymak")) return "restoran";
        if (lower.includes("müze")) return "müze";
        if (lower.includes("tarihi") || lower.includes("kale") || lower.includes("cami")) return "tarihi";
        return null;
    };

    const getFiyat = (text) => {
        const match = text.match(/(\d{2,5})\s*(tl|\u20ba)?/i);
        return match ? parseInt(match[1]) : null;
    };

    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getOnerilenMekan = async (kategori, fiyatLimit, excludeAd = null) => {
        try {
            const q = query(
                collection(db, "mekanlar"),
                where("kategori", "in", [kategori, kategori.charAt(0).toUpperCase() + kategori.slice(1)])
            );

            const snapshot = await getDocs(q);
            let mekanlar = snapshot.docs
                .map(doc => doc.data())
                .filter(m => m.konum && m.konum.latitude && m.konum.longitude);

            mekanlar = mekanlar.filter(m => {
                if (excludeAd && m.ad === excludeAd) return false;
                if (!fiyatLimit) return true;
                const raw = m.ortalamaFiyat.replace(/[^\d]/g, "");
                const fiyat = parseInt(raw);
                return !isNaN(fiyat) && fiyat <= fiyatLimit;
            });

            if (konum) {
                mekanlar.sort((a, b) => {
                    const d1 = haversine(konum.lat, konum.lng, a.konum.latitude, a.konum.longitude);
                    const d2 = haversine(konum.lat, konum.lng, b.konum.latitude, b.konum.longitude);
                    return d1 - d2;
                });
            }

            return mekanlar.length > 0 ? mekanlar[0] : null;
        } catch (e) {
            console.error("Mekan getirme hatası:", e);
            return null;
        }
    };

    const handleAsk = async (yeniIstek = false) => {
        setLoading(true);
        const kategori = yeniIstek ? sonKategori : getKategori(userInput);
        const fiyat = yeniIstek ? sonFiyat : getFiyat(userInput);
        if (!yeniIstek) {
            setSonKategori(kategori);
            setSonFiyat(fiyat);
        }

        const mekan = kategori ? await getOnerilenMekan(kategori, fiyat, yeniIstek ? messages[messages.length - 1]?.mekanAd : null) : null;

        if (!mekan) {
            setMessages([...messages, { role: "user", content: userInput }, { role: "assistant", content: "Üzgünüm, bu kategori ve fiyata uygun bir mekan bulunamadı." }]);
            setUserInput("");
            setLoading(false);
            return;
        }

        const enrichedPrompt = `Kullanıcının sorusu: "${userInput}"

Sadece aşağıdaki bilgilerle yanıt ver:

- Ad: ${mekan.ad}
- Açıklama: ${mekan.aciklama}
- Ortalama Fiyat: ${mekan.ortalamaFiyat}
- Puan: ${mekan.puan}
- Açılış: ${mekan.acilisSaati} - Kapanış: ${mekan.kapanisSaati}`;

        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer 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",
                },
                body: JSON.stringify({
                    model: "openai/gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Sen Elazığ Şehir rehberi için çalışan bir asistansın. Sadece verilen mekana ait bilgilerle yanıt ver, başka yer uydurma."
                        },
                        { role: "user", content: enrichedPrompt },
                    ],
                }),
            });

            const data = await res.json();
            const yanit = data?.choices?.[0]?.message?.content || "Yanıt alınamadı.";
            const newMessages = [...messages];
            if (!yeniIstek) newMessages.push({ role: "user", content: userInput });
            newMessages.push({ role: "assistant", content: yanit, mekanAd: mekan?.ad });
            setMessages(newMessages);
            setUserInput("");
        } catch (e) {
            console.error("AI hatası:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <h2>Yapay Zekâ Asistanı 🤖</h2>
            <textarea
                rows="4"
                cols="50"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ortalama 200 TL ile nereye gidebilirim?"
            />
            <br />
            <button onClick={() => handleAsk(false)} disabled={loading}>
                {loading ? "Yanıtlanıyor..." : "Sor"}
            </button>
            {sonKategori && (
                <button onClick={() => handleAsk(true)} disabled={loading} style={{ marginLeft: 10 }}>
                    Başka öneri göster
                </button>
            )}

            <div style={{ marginTop: 30 }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-start" : "flex-end",
                        margin: "10px 0"
                    }}>
                        <div style={{
                            padding: "12px 16px",
                            backgroundColor: msg.role === "user" ? "#f1f1f1" : "#d1e7dd",
                            borderRadius: 16,
                            maxWidth: "70%",
                            textAlign: "left",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assistant;