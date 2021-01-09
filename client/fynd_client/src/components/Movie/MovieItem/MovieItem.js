import styles from './MovieItem.module.css';

function MovieItem(props) {
  let isModify = null;
  if(props.movie.isModificationAllowed){
    console.log("props.movie.isModificationAllowed",props.movie.isModificationAllowed);
    isModify = 
    (<div class={styles.DeleteEdit}>
    <span 
    class={`${styles.Icon} ${styles.Delete} material-icons`}
    onClick={()=>props.onDeleteClickHandler(props.movie._id)}>
      delete
    </span>
    <span 
    class={`${styles.Icon} ${styles.Edit}  material-icons`}
    onClick={()=>props.onEditClickHandler(props.movie)}>
      edit
    </span>
    </div>)
  }
  return (
    <div className={styles.MovieItem}>
      <div class="col s12">
        <div class={`${styles.MovieItem} card`}>
        {isModify}
          <ul class={`card-content ${styles.Tags} row`}>
            <li className="col s6 "><b>Name</b> : {props.movie.name}</li>
            <li className="col s6 center"><b>Director</b> : {props.movie.director}</li>
            <li className="col s6 "><b>99popularity</b> : {props.movie["99popularity"]}</li>
            <li className="col s6 center"><b>IMDB</b> : {props.movie.imdb_score}</li>
            <li className="col s6 "><b>Genre</b> : {props.movie.genre}</li>
          </ul>
          
        </div>
      </div>
    </div>
  );
}

export default MovieItem;