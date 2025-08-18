export async function fetchNewsFromSources(query) {
  try {
    // 🚀 Panggil backend di Render (ubah URL sesuai domain Render kamu)
    // const response = await fetch(`https://your-render-app.onrender.com/api/news?q=${encodeURIComponent(query)}`);
    const response = await fetch(`http://localhost:3000/api/news?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return [];
  }
}
