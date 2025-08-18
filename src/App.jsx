import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { fetchNewsFromSources, fetchNewsAtStart } from "./searchService.js";
import "./App.css";

function formatDate(isoDate, useLocalTime = true) {
  const date = new Date(isoDate);

  const day = String(useLocalTime ? date.getDate() : date.getUTCDate()).padStart(2, "0");
  const month = String((useLocalTime ? date.getMonth() : date.getUTCMonth()) + 1).padStart(2, "0");
  const year = useLocalTime ? date.getFullYear() : date.getUTCFullYear();
  const hours = String(useLocalTime ? date.getHours() : date.getUTCHours()).padStart(2, "0");
  const minutes = String(useLocalTime ? date.getMinutes() : date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function ToWebButton({ url }) {
  return (
    <button onClick={() => window.open(url, "_blank")}>
      Go to URL
    </button>
  );
}

function App() {
  const dummyNews = [
    { id: 1, title: "AI Mengubah Industri Teknologi", date: "2025-08-18", imageUrl: "/dummy.png", content: "AI semakin banyak digunakan di berbagai industri untuk meningkatkan produktivitas." },
    { id: 2, title: "React 19 Resmi Dirilis", date: "2025-08-17", content: "React 19 membawa banyak fitur baru termasuk server components dan peningkatan performance." },
    { id: 3, title: "OpenAI Luncurkan GPT-5", date: "2025-08-16", content: "GPT-5 memiliki kemampuan reasoning yang lebih baik dan dukungan multimodal." },
    { id: 4, title: "Vite Semakin Populer di Frontend Dev", date: "2025-08-15", content: "Vite menjadi pilihan utama developer karena build super cepat dan dukungan plugin ekosistem yang luas." },
  ];

  const [selectedNews, setSelectedNews] = useState(null);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // jumlah berita per halaman

  useEffect(() => {
    const fetchInitialNews = async () => {
      try {
        const results = await fetchNewsAtStart();
        setArticles(results);
      } catch (err) {
        console.error("Error fetching news at start:", err);
      }
    };
    fetchInitialNews();
  }, []);

  const handleSearch = async (query) => {
    const results = await fetchNewsFromSources(query);
    setArticles(results);
    setSelectedNews(null);
    setCurrentPage(1); // reset ke halaman 1
  };

  const dataToShow = articles.length > 0 ? articles : dummyNews;

  // 🔹 Pagination logic
  const totalPages = Math.ceil(dataToShow.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = dataToShow.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="app">
      <Navbar onSearch={handleSearch} />
      <main className="content">
        {selectedNews ? (
          // Halaman Detail Berita
          <div className="news-detail">
            <img
              src={selectedNews.image || "https://placehold.co/800x600?text=No+Image"}
              alt={selectedNews.title}
              className="news-detail-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/800x600?text=No+Image";
              }}
            />
            <h1>{selectedNews.title}</h1>
            <p className="date">{formatDate(selectedNews.date)}</p>
            <p className="date">From {selectedNews.source}</p>
            <p className="content-text">{selectedNews.content}</p>
            <ToWebButton url={selectedNews.url} />
            <button className="back-btn" onClick={() => setSelectedNews(null)}>
              ← Kembali
            </button>
          </div>
        ) : (
          // Halaman List Berita
          <div className="news-list">
            <h1 className="title">Berita Terbaru</h1>
            <div className="news-grid">
              {paginatedData.length > 0 ? (
                paginatedData.map((news, index) => (
                  <div
                    key={news.id || index}
                    className="news-card"
                    onClick={() => setSelectedNews(news)}
                  >
                    <img
                      src={news.image || "https://placehold.co/120x80?text=No+Image"}
                      alt={news.title}
                      className="news-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/120x80";
                      }}
                    />
                    <div className="news-info">
                      <h2>{news.title}</h2>
                      <p>{formatDate(news.date) || news.source}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Tidak ada berita ditemukan.</p>
              )}
            </div>

            {/* 🔹 Pagination controls */}
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                ← Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
