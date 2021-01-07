import styles from './MovieItem.module.css';

function MovieItem(props) {
  return (
    <div className={styles.MovieItem}>
      <div class="col s12 m2">
        <div class="card">
          <ul class={`card-content ${styles.Tags}`}>
            {props.movie.name}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MovieItem;