import styles from './Movie.module.css';
import MovieItem from './MovieItem/MovieItem';

function Movie(props) {
  let MovieArr = null;
  if(props.MovieList && props.MovieList.length > 0){
    MovieArr = props.MovieList.map((e)=>{
      return <MovieItem movie={e} onDeleteClickHandler={props.onDeleteSpanClickHandler}
      onEditClickHandler={props.onEditSpanClickHandler}
      />
    })
  }


  return (
    <div className={`${styles.Movie} col s12`}>
      {MovieArr}
    </div>
  );
}

export default Movie;