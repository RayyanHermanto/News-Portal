# News Portal

A modern news portal built with **React** and **Vite**, designed to display news articles fetched from multiple news APIs. Most of the displayed news content is likely related to **Artificial Intelligence (AI)**.

## Features

- Fetch news from multiple APIs, including:
  - NewsAPI
  - TheNewsAPI
  - GNewsAPI
  - NewsDataAPI
- Search functionality to filter news by keywords.
- Display the latest news on page load.
- Responsive and user-friendly interface.
- Loading indicators when fetching data.

## Tech Stack

- **React** – UI library
- **Vite** – Build tool and development server
- **JavaScript (ES6+)** – Core language
- **CSS Grid & Flexbox** – Layout styling
- **Fetch API** – API requests

## Getting Started

### Prerequisites

- Node.js v18+  
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/RayyanHermanto/News-Portal.git
cd News-Portal
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
News-Portal/
│
├─ public/               # Static assets
├─ src/
│  ├─ components/        # React components
│  ├─ searchServices.js          # API fetch logic
│  ├─ App.jsx            # Main App component
│  └─ main.jsx           # React entry point
├─ package.json
└─ vite.config.js
```

## Usage

- On page load, the portal fetches news from all sources.
- Use the search bar to filter news articles by keywords (like "AI").
- Click on a news title to read the full article in a new tab.

## Notes

- Some APIs may have rate limits or require an API key.
- The displayed news content is mostly related to Artificial Intelligence.

## License

This project is open-source and available under the [MIT License](LICENSE).

