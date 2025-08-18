export async function fetchNewsFromSources(query) {
  try {
    // const response = await fetch(`https://your-render-app.onrender.com/api/news?q=${encodeURIComponent(query)}`);
    const response = await fetch(`http://backend-production-8abc.up.railway.app/api/news?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return [];
  }
}

export async function fetchNewsAtStart(){
  try {
    const response = await fetch(`http://backend-production-8abc.up.railway.app/api/newStart`);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error fetching from backend:", error);
    return [];
  }
}