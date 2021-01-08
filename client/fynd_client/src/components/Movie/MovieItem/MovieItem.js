import styles from './MovieItem.module.css';

function MovieItem(props) {
  let isModify = null;
  if(props.movie.isModificationAllowed){
    console.log("props.movie.isModificationAllowed",props.movie.isModificationAllowed);
    isModify = 
    (<div class={styles.DeleteEdit}>
    <span 
    class={`${styles.Icon} material-icons`}
    onClick={()=>props.onDeleteClickHandler(props.movie._id)}>
      delete
    </span>
    <span 
    class={`${styles.Icon} material-icons`}
    onClick={()=>props.onEditClickHandler(props.movie)}>
      edit
    </span>
    </div>)
  }
  return (
    <div className={styles.MovieItem}>
      <div class="col s12">
        <div class="card">
        {isModify}
          <ul class={`card-content ${styles.Tags}`}>
            <li><b>Name</b> : {props.movie.name}</li>
            <li><b>Director</b> : {props.movie.director}</li>
            <li><b>99popularity</b> : {props.movie["99popularity"]}</li>
            <li><b>IMDB</b> : {props.movie.imdb_score}</li>
            <li><b>Genre</b> : {props.movie.genre}</li>
          </ul>
          
        </div>
      </div>
    </div>
  );
}

export default MovieItem;