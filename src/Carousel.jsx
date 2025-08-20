import { useState, useEffect } from "react";
import "./Carousel.css";

function Carousel({ items, interval = 3000, onItemClick }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        }, interval);
        return () => clearInterval(timer);
    }, [items.length, interval]);

    if (!items || items.length === 0) return null;

    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);

    return (
        <div className="carousel">
        {items.map((item, index) => (
            <div
            key={index}
            className={`carousel-item ${index === currentIndex ? "active" : ""}`}
            onClick={() => onItemClick && onItemClick(item)} // tambahkan onClick
            style={{ cursor: onItemClick ? "pointer" : "default" }}
            >
            <img 
                src={item.image || "Noimage.svg"} 
                alt={item.title} 
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "Noimage.svg";
                  }}
            />
            <div className="carousel-caption">
                <h3>{item.title}</h3>
                <p>{item.content || ""}</p>
            </div>
            </div>
        ))}

        <button className="carousel-btn left" onClick={prevSlide}>&#10094;</button>
        <button className="carousel-btn right" onClick={nextSlide}>&#10095;</button>
        </div>
    );
}


export default Carousel;
