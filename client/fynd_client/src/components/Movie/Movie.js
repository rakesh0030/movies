import styles from './Movie.module.css';
import MovieItem from './MovieItem/MovieItem';

function Movie(props) {
  let MovieArr = null;
  if(props.MovieList && props.MovieList.length > 0){
    MovieArr = props.MovieList.map((e)=>{
      return <MovieItem movie={e}/>
    })
  }


  return (
    <div className={styles.Movie}>
      {MovieArr}
    </div>
  );
}

export default Movie;