import styles from './MovieItem.module.css';

function MovieItem(props) {
  let isModify = null;
  if(props.movie.isModificationAllowed){
    isModify = <span onClick={()=>props.onClickHandler(props.movie._id)}>
      Delete
    </span>
  }
  return (
    <div className={styles.MovieItem}>
      <div class="col s12 m2">
        <div class="card">
          <ul class={`card-content ${styles.Tags}`}>
            {props.movie.name}
          </ul>
          {isModify}
        </div>
      </div>
    </div>
  );
}

export default MovieItem;