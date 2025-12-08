import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/Cards_data";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { AddToWishlist, getWishlist, removeFromWishlist } from "../../firebase";

export const TitleCards = ({ title = "Popular on Netflix", category = "now_playing" }) => {
  const { userId } = useAuth();
  const [apiData, setApiData] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const cardsRef = useRef();

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await getWishlist(userId);
      setWishlist(data || []);
    }
    console.log(wishlist, 'wishlist');
    fetchWishlist();
  }, [userId]);

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjM5OTM1YzRmZjA1ODUzNjY2Y2MxYTMwNjdkODFkZSIsIm5iZiI6MTc2MzcxNDYzMC4xNzcsInN1YiI6IjY5MjAyNjQ2ZjQ0MDZjYzBiZjJlMzA2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GpP-d6DDxI5AfHBLufy53I2KI1Mfmafm8mTK7MiL4qg'
  }
};

// fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

  const handleWheel = (e) => {
    e.preventDefault;
    cardsRef.current.scrollLeft += e.deltaY;
  };

  const toggleWishlist = async (id) => {
    if (wishlist.includes(id)) {
      await removeFromWishlist(userId, id);
    }else{
      await AddToWishlist(userId, id);
    }

    const data = await getWishlist(userId);
    setWishlist(data || []);
  }

  useEffect(() => {
  if (!category || typeof category !== "string") {
    console.error("Category must be a string");
    return;
  }

  fetch(
    `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`,
    options
  )
    .then(res => res.json())
    .then(res => setApiData(res.results))
    .catch(err => console.error(err));
}, [category]);


  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <div className="card" key={index}>
            <Link to={`/player/${card.id}`} className="card" key={index}>
              <img
                src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path}
                alt=""
                />
              <p>{card.original_title}</p>
            </Link>
            <div className={`wishlist-icon ${wishlist.includes(card.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(card.id)}
              title={wishlist.includes(card.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {wishlist.includes(card.id) ? '❤️' : '♡'}
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};