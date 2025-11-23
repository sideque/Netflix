import  { useEffect, useState } from 'react'
import './player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useParams } from 'react-router-dom'

const Player = () => {

  const {id} = useParams();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    typeof: ""
  })

  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjM5OTM1YzRmZjA1ODUzNjY2Y2MxYTMwNjdkODFkZSIsIm5iZiI6MTc2MzcxNDYzMC4xNzcsInN1YiI6IjY5MjAyNjQ2ZjQ0MDZjYzBiZjJlMzA2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GpP-d6DDxI5AfHBLufy53I2KI1Mfmafm8mTK7MiL4qg'
  }
};

useEffect(() => {

  fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
    .then(res => res.json())
    .then(res => setApiData(res.ressults[0]))
    .catch(err => console.error(err));

}, []);



  return (
    <div className='player'>
        <img src={back_arrow_icon} alt="" />
        <iframe width="90%" height="90%"
          src={`https://www.youtube.com/embed/${apiData.key}`}
        title='trailer' frameBorder='0' allowFullScreen></iframe>
        <div className="player-info">
          <p>{apiData.published_at.slice(0, 10)}</p>
          <p>{apiData.name}</p>
          <p>{apiData.type}</p>
        </div>
    </div>
  )
}

export default Player