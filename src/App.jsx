import { useState } from "react";
import Navbar from "./Navbar";
import { fetchNewsFromSources } from "./searchService.js";
import "./App.css";

function App() {
  const dummyNews = [
    { id: 1, title: "AI Mengubah Industri Teknologi", date: "2025-08-18", imageUrl: "/dummy.png", content: "AI semakin banyak digunakan di berbagai industri untuk meningkatkan produktivitas." },
    { id: 2, title: "React 19 Resmi Dirilis", date: "2025-08-17", content: "React 19 membawa banyak fitur baru termasuk server components dan peningkatan performance." },
    { id: 3, title: "OpenAI Luncurkan GPT-5", date: "2025-08-16", content: "GPT-5 memiliki kemampuan reasoning yang lebih baik dan dukungan multimodal." },
    { id: 4, title: "Vite Semakin Populer di Frontend Dev", date: "2025-08-15", content: "Vite menjadi pilihan utama developer karena build super cepat dan dukungan plugin ekosistem yang luas." },
  ];

  const [selectedNews, setSelectedNews] = useState(null);
  const [articles, setArticles] = useState([]);

  const handleSearch = async (query) => {
    const results = await fetchNewsFromSources(query);
    setArticles(results);
    setSelectedNews(null); // reset kalau sedang di detail
  };

  const dataToShow = articles.length > 0 ? articles : dummyNews;

  return (
    <div className="app">
      <Navbar onSearch={handleSearch} />

      <main className="content">
        {selectedNews ? (
          // ✅ Halaman Detail Berita
          <div className="news-detail">
            <img
              src={selectedNews.imageUrl || "https://placehold.co/800x600?text=No+Image"}
              alt={selectedNews.title}
              className="news-detail-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/800x600?text=No+Image";
              }}
            />
            <h1>{selectedNews.title}</h1>
            <p className="date">{selectedNews.date}</p>
            <p className="content-text">{selectedNews.content}</p>
            <button className="back-btn" onClick={() => setSelectedNews(null)}>
              ← Kembali
            </button>
          </div>

        ) : (
          // ✅ Halaman List Berita
          <div className="news-list">
            <h1 className="title">Berita Terbaru</h1>
            <div className="news-grid">
              {dataToShow.length > 0 ? (
                dataToShow.map((news, index) => (
                  <div
                    key={news.id || index}
                    className="news-card"
                    onClick={() => setSelectedNews(news)}
                  >
                    <img
                      src={news.imageUrl || "https://placehold.co/120x80?text=No+Image"}
                      alt={news.title}
                      className="news-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/120x80";
                      }}
                    />
                    <div className="news-info">
                      <h2>{news.title}</h2>
                      <p>{news.date || news.source}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Tidak ada berita ditemukan.</p>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
