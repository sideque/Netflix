import  { useEffect, useState } from 'react'
import './player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

const Player = () => {
  const location = useLocation();
  const fromWishlist = location.state?.from === "wishlist";
  const {id} = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjM5OTM1YzRmZjA1ODUzNjY2Y2MxYTMwNjdkODFkZSIsIm5iZiI6MTc2MzcxNDYzMC4xNzcsInN1YiI6IjY5MjAyNjQ2ZjQ0MDZjYzBiZjJlMzA2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GpP-d6DDxI5AfHBLufy53I2KI1Mfmafm8mTK7MiL4qg'
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(res => {
        const vids = res.results || [];
        const yt = vids.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || vids[0] || null;
        setApiData(yt);
      })
      .catch(err => {
        console.error(err);
        setApiData(null);
      })
      .finally(() => setLoading(false));
  }, [id]);


  return (
    <div className='player'>
        <img src={back_arrow_icon} alt="back" onClick={() => {
          if (fromWishlist) {
            navigate("/wishlist")
          }else{
            navigate("/")
          }
        }} style={{cursor: 'pointer'}} />
        {loading ? (
          <p style={{color: 'white'}}>Loading...</p>
        ) : apiData && apiData.key ? (
          <iframe width="90%" height="90%"
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title='trailer' frameBorder='0' allowFullScreen></iframe>
        ) : (
          <div style={{color: 'white'}}>Trailer not available</div>
        )}

        <div className="player-info">
          <p>{apiData?.published_at ? apiData.published_at.slice(0, 10) : '-'}</p>
          <p>{apiData?.name || '-'}</p>
          <p>{apiData?.type || '-'}</p>
        </div>
    </div>
  )
}

export default Player