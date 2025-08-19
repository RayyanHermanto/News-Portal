import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { fetchNewsFromSources, fetchNewsAtStart } from "./searchService.js";
import Carousel from "./Carousel.jsx";
import { PropagateLoader } from "react-spinners";
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
    <button className="toUrl-btn" onClick={() => window.open(url, "_blank")}>
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
  const [isSearch, setisSearch] = useState(true);
  const [lastQuery, setLastQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const pageSize = 15;
  const carouselItem = useRef(null);

  useEffect(() => {
    const fetchInitialNews = async () => {
      try {
        setLoading(true);
        const results = await fetchNewsAtStart();
        setArticles(results);
      } catch (err) {
        console.error("Error fetching news at start:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialNews();
  }, []);
  
  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const results = await fetchNewsFromSources(query);
      setArticles(results);
      setSelectedNews(null);
      setCurrentPage(1);
      setisSearch(false);
      setLastQuery(query);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const dataToShow = articles;

  // 🔹 Pagination logic
  const totalPages = Math.ceil(dataToShow.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const TempData = dataToShow.slice(startIndex, startIndex + pageSize);
  carouselItem.current = currentPage === 1 ? TempData.slice(0, 3) : carouselItem.current;
  const paginatedData = currentPage === 1 ? TempData.slice(3) : TempData;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="loading">
        <PropagateLoader color="#36d7b7" size={15} />
      </div>
    );
  }
  
  return (
    <div className="app">
      <Navbar onSearch={handleSearch} />
      <main className="content">
        {selectedNews ? (
          // Halaman Detail Berita
          <div className="news-detail">
            <img
              src={selectedNews.image || "Noimage.svg"}
              alt={selectedNews.title}
              className="news-detail-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "Noimage.svg";
              }}
            />
            <h1>{selectedNews.title}</h1>
            <p className="date">{formatDate(selectedNews.date)}</p>
            <p className="date">From {selectedNews.source}</p>
            <p className="content-text">{selectedNews.content}</p>
            <ToWebButton url={selectedNews.url} />
            <button className="back-btn" onClick={() => setSelectedNews(null)}>
              Back
            </button>
          </div>
        ) : (
          // Halaman List Berita
          <div className="news-list">
            {isSearch && (
              <Carousel 
                items={carouselItem.current} // langsung ambil objek berita utuh
                interval={4000}
                onItemClick={(news) => setSelectedNews(news)} // kirim callback
              />
            )}
            {isSearch ? (
              <h1 className="title">Latest News</h1>
              ):(
              <h1 className="title">{articles.length} articles found for '{lastQuery}'</h1>
            )}
            <div className="news-grid">
              {paginatedData.length > 0 ? (
                paginatedData.map((news, index) => (
                  <div
                    key={news.id || index}
                    className="news-card"
                    onClick={() => setSelectedNews(news)}
                  >
                    <img
                      src={news.image || "Noimage.svg"}
                      alt={news.title}
                      className="news-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "Noimage.svg";
                      }}
                    />
                    <div className="news-info">
                      <h2>{news.title}</h2>
                      <p>{formatDate(news.date) || news.source}</p>
                    </div>
                  </div>
                ))
              ) : (
                !isSearch && lastQuery ? (
                  <p>Search for '{lastQuery}' not found.</p>
                ) : (
                  <p>Tidak ada berita ditemukan.</p>
                )
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
