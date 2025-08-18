import Fuse from "fuse.js";

// 🔧 daftar kata kunci alternatif untuk memperbaiki typo
const keywords = ["AI", "Artificial Intelligence", "Machine Learning", "React", "OpenAI", "mengubah"];

const dummyNews = [
    { id: 1, title: "AI Mengubah Industri Teknologi", date: "2025-08-18", content: "AI semakin banyak digunakan di berbagai industri untuk meningkatkan produktivitas." },
    { id: 2, title: "React 19 Resmi Dirilis", date: "2025-08-17", content: "React 19 membawa banyak fitur baru termasuk server components dan peningkatan performance." },
    { id: 3, title: "OpenAI Luncurkan GPT-5", date: "2025-08-16", content: "GPT-5 memiliki kemampuan reasoning yang lebih baik dan dukungan multimodal." },
    { id: 4, title: "Vite Semakin Populer di Frontend Dev", date: "2025-08-15", content: "Vite menjadi pilihan utama developer karena build super cepat dan dukungan plugin ekosistem yang luas." },
  ];

// Fuse.js untuk fuzzy search langsung ke dummyNews
const fuse = new Fuse(dummyNews, {
  keys: ["title", "content"], // cari di judul & isi berita
  threshold: 0.4,             // makin kecil → makin strict
});

function fixQuery(query) {
  const result = fuse.search(query);
  console.log(result);
  return result.length > 0 ? result.map(r => r.item) : [];
}

// thenewsAPI
// const api2 = ` https://gnews.io/api/v4/search?q=${query}&sortby=relevance&apikey=${API_KEY2}`

const API_KEY1 = `d7860e37218a49df9b7010cc04bb26d6`;
const API_KEY2 = `MsPwDUFvutdoVqKjwnSfMqlHRnHlyx70YIVFFwKr`;
const API_KEY3 = `41dbdad3069cbb139cf1c67972175e42`;
const API_KEY4 = `pub_e3d3abc51b914e0f9d8f4592bef65ba0`;

export async function fetchNewsFromSources(query) {
    const urls = [
    `https://newsapi.org/v2/everything?q=${query}sortBy=popularity&apiKey=${API_KEY1}`,
    `https://gnews.io/api/v4/search?q=${query}&sortby=relevance&apikey=${API_KEY3}`,
    `https://newsdata.io/api/1/latest?apikey=${API_KEY4}&q=${query}&country=id,us&language=id,en&timezone=Asia/Jakarta`
    ]
    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
    const data = await Promise.all(responses.map(res => res.json()));

    // Normalisasi hasil dari tiap API (karena struktur datanya beda2)
    const articles = [];

    // ✅ NewsAPI
    if (data[0].articles) {
      data[0].articles.forEach((a, idx) => {
        articles.push({
          id: `newsapi-${idx}`,
          title: a.title,
          date: a.publishedAt,
          content: a.description,
          url: a.url,
          image: a.urlToImage,
          source: "NewsAPI"
        });
      });
    }

    // ✅ GNews
    if (data[1].articles) {
      data[1].articles.forEach((a, idx) => {
        articles.push({
          id: `gnews-${idx}`,
          title: a.title,
          date: a.publishedAt,
          content: a.description,
          url: a.url,
          image: a.image,
          source: "GNews"
        });
      });
    }

    // ✅ NewsData.io
    if (data[2].results) {
      data[2].results.forEach((a, idx) => {
        articles.push({
          id: `newsdata-${idx}`,
          title: a.title,
          date: a.pubDate,
          content: a.description,
          url: a.link,
          image: a.image_url,
          source: "NewsData.io"
        });
      });
    }

    return articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
    const filtered = fixQuery(query);

    // kalau tidak ada hasil fuzzy → fallback semua dummyNews
    if (filtered.length === 0) {
        return dummyNews.map(n => ({
        title: n.title,
        url: "#",
        source: "Dummy",
        date: n.date,
        content: n.content
        }));
    }

    return filtered.map(n => ({
        title: n.title,
        url: "#",
        source: "Dummy",
        date: n.date,
        content: n.content
    }));

  /*
  // kalau nanti mau aktifin API tinggal buka ini:
  const urls = [
    `https://newsapi.org/v2/everything?q=${query}&apiKey=YOUR_KEY`,
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=YOUR_KEY`,
    `https://gnews.io/api/v4/search?q=${query}&token=YOUR_KEY`
  ];
  */
}


// const fuse = new Fuse(keywords, {
//   threshold: 0.3,
// });

// function fixQuery(query) {
//   const result = fuse.search(query);
//   return result.length > 0 ? result[0].item : query; 
// }

// export async function fetchNewsFromSources(query) {
//   const correctedQuery = fixQuery(query);

//   // contoh 3 API berita (ganti dengan API publik yang valid)
//   const urls = [
//     `https://newsapi.org/v2/everything?q=${correctedQuery}&apiKey=YOUR_KEY`,
//     `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${correctedQuery}&api-key=YOUR_KEY`,
//     `https://gnews.io/api/v4/search?q=${correctedQuery}&token=YOUR_KEY`
//   ];

//   try {
//     const responses = await Promise.all(urls.map(url => fetch(url)));
//     const data = await Promise.all(responses.map(res => res.json()));

//     // normalisasi data jadi 1 format array
//     const merged = [];

//     if (data[0].articles) {
//       merged.push(...data[0].articles.map(a => ({
//         title: a.title,
//         url: a.url,
//         source: "NewsAPI"
//       })));
//     }

//     if (data[1].response?.docs) {
//       merged.push(...data[1].response.docs.map(a => ({
//         title: a.headline.main,
//         url: a.web_url,
//         source: "NYTimes"
//       })));
//     }

//     if (data[2].articles) {
//       merged.push(...data[2].articles.map(a => ({
//         title: a.title,
//         url: a.url,
//         source: "GNews"
//       })));
//     }

//     // kalau hasil fetch kosong → pakai dummy
//     if (merged.length === 0) {
//       return [
//         { title: `Dummy berita tentang ${correctedQuery} #1`, url: "#", source: "kosong" },
//         { title: `Dummy berita tentang ${correctedQuery} #2`, url: "#", source: "kosong" },
//         { title: `Dummy berita tentang ${correctedQuery} #3`, url: "#", source: "kosong" }
//       ];
//     }

//     return merged;
//   } catch (err) {
//     console.error("Error fetching news:", err);
//     // fallback dummy kalau error
//     return [
//       { title: `Dummy berita tentang ${correctedQuery} #1`, url: "#", source: "Error" },
//       { title: `Dummy berita tentang ${correctedQuery} #2`, url: "#", source: "Error" },
//       { title: `Dummy berita tentang ${correctedQuery} #3`, url: "#", source: "Error" }
//     ];
//   }
// }
