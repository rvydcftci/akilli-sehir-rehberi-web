# 🌐 Smart City Guide – Web Application  
# 🌐 Akıllı Şehir Rehberi – Web Uygulaması

**Smart City Guide** is a modern and interactive web application designed to help users explore places such as restaurants, cafes, museums, and historical sites within a city. The app allows users to browse venues, read and leave reviews, and receive AI-powered recommendations tailored to their preferences.  
**Akıllı Şehir Rehberi**, şehirdeki restoran, kafe, müze ve tarihi yerleri listeleyen, kullanıcı yorumlarını gösteren ve yapay zekâ destekli öneriler sunan modern ve etkileşimli bir web uygulamasıdır.

---

## ✨ Features  
## ✨ Özellikler

- 🔐 **User Authentication** – Sign up and login via Firebase  
  🔐 **Kullanıcı Giriş/Kayıt** – Firebase ile giriş ve kayıt sistemi

- 📍 **Location-Based Recommendations** – Suggests the nearest venue using distance calculations  
  📍 **Konum Tabanlı Öneri Sistemi** – En yakın mekanı önerir (mesafeye göre)

- ⭐ **Ratings & Reviews** – Users can leave comments and rate venues  
  ⭐ **Yorum ve Puanlama** – Mekanlara yorum ve yıldız puanı verme

- ❤️ ➕ **Favorites and To-Visit Lists** – Save venues for future reference  
  ❤️ ➕ **Favori ve Gidilecek Yerler** – Mekanları kaydedip takip etme

- 💬 **AI Assistant** – Chatbot powered by OpenRouter API  
  💬 **Yapay Zekâ Asistanı** – OpenRouter destekli sohbet botu

- 🗂️ **Category Filters** – Filter by cafes, restaurants, museums, or historical sites  
  🗂️ **Kategori Filtreleri** – Kafe, restoran, müze ve tarihi yer bazlı filtreleme

- 📊 **Price Range Filtering** – Find places within your budget  
  📊 **Fiyat Aralığına Göre Filtreleme** – Belirli bütçeye uygun mekanları listeleme

- 🔎 **Smart Search** – Case-insensitive and Turkish-character-tolerant search engine  
  🔎 **Akıllı Arama** – Büyük/küçük harf duyarsız ve Türkçe karakter toleranslı arama

- 📱 **Responsive Design** – Optimized for both desktop and mobile  
  📱 **Responsive Tasarım** – Mobil ve masaüstü uyumlu arayüz

---

## 🛠️ Technologies Used  
## 🛠️ Kullanılan Teknolojiler

- **React.js** – Frontend development  
  **React.js** – Arayüz geliştirme

- **Firebase** – Authentication, Firestore  
  **Firebase** – Giriş sistemi, veritabanı

- **React Router** – Page navigation  
  **React Router** – Sayfalar arası geçiş

- **OpenRouter API** – AI assistant integration  
  **OpenRouter API** – Yapay zekâ asistanı entegrasyonu

- **Tailwind CSS** – UI design  
  **Tailwind CSS** – Arayüz tasarımı

- **Framer Motion** – Animations and transitions  
  **Framer Motion** – Animasyonlar ve geçiş efektleri

- **Lucide Icons** – Icon library  
  **Lucide Icons** – İkon kütüphanesi

---

## 📸 Pages Overview  
## 📸 Sayfa Yapısı

- 🏠 **Home** – Welcome message, featured places, category cards  
  🏠 **Ana Sayfa** – Hoş geldin mesajı, öne çıkan mekanlar, kategori kartları

- 🧭 **Places** – Venue cards with images, ratings, favorite/to-visit buttons  
  🧭 **Mekanlar** – Görsel, puan, favori/gidilecek butonları ile mekan kartları

- 🔎 **Search** – Smart search by name or location  
  🔎 **Arama** – İsme veya konuma göre akıllı arama

- 🧑 **Profile** – User info, favorite and to-visit lists  
  🧑 **Profil** – Kullanıcı bilgileri, favori ve gidilecek yer listesi

- 💬 **Assistant** – Chat-based recommendation assistant  
  💬 **Asistan** – Sohbet arayüzlü öneri asistanı

---

## 🚀 Getting Started  
## 🚀 Başlarken

### Prerequisites  
### Gereksinimler

- [Node.js](https://nodejs.org/)
- Firebase config must be stored securely in a `.env` file  
  Firebase ayarları `.env` dosyasında gizli tutulmalıdır.

### Installation  
### Kurulum

```bash
git clone https://github.com/rvydcftci/akilli-sehir-rehberi-web.git
cd akilli-sehir-rehberi-web
npm install
npm start
📌 Notlar
AI assistant generates dynamic suggestions based on Firestore venue data.
Yapay zekâ asistanı, Firestore’daki mekan verilerine göre öneri üretir.

The same Firebase project is shared between web and mobile versions.
Web ve mobil uygulamalar aynı Firebase projesini kullanır.
