import styles from './MovieItem.module.css';

function MovieItem(props) {
  let isModify = <div class={styles.DeleteEdit}></div>;
  if(props.movie.isModificationAllowed){
    console.log("props.movie.isModificationAllowed",props.movie.isModificationAllowed);
    isModify = 
    (<div class={styles.DeleteEdit}>
    <span 
    class={`${styles.Icon} ${styles.Delete} material-icons tooltipped`} data-position="right" data-tooltip="Delete"
    onClick={()=>props.onDeleteClickHandler(props.movie._id)}>
      delete
    </span>
    <span 
    class={`${styles.Icon} ${styles.Edit}  material-icons tooltipped`} data-position="right" data-tooltip="Edit"
    onClick={()=>props.onEditClickHandler(props.movie)}>
      edit
    </span>
    </div>)
  }
  return (
    <div className="card">
      <div className={styles.MovieItem}>
        <div className={styles.MovieAndDirector}>
          <div className={styles.Movie}>
            {props.movie.name}
          </div>
          <div className={styles.Director}>
            {props.movie.director}
          </div>
        </div>
        <div className={styles.PopularitySection}>
          <div className={styles.Popularity}>
            {props.movie["99popularity"]}
          </div>
          <br />
           <span className={styles.PopularitySpan}>( Popularity )</span> 
        </div>
        <div className={styles.IMDBAndGenre}>
          <div className={styles.IMDB}>
            {props.movie.imdb_score}
            <span className={styles.IMDBSpan}>( imdb )</span> 
          </div>
          <div className={styles.Genre}>
            {props.movie.genre}
          </div>
        </div>
        {isModify}
      </div>
    </div>
  );
}

/*<body>
<div
  style="
    background-color: #424345;
    height: 150px;
    width: 850px;
    display: flex;
    justify-content: space-around;
  "
>
  <div style="width: 40%">
    <div
      style="
        font-family: 'Potta One', cursive;
        color: #fefeff;
        text-decoration: bold;
        font-size: 60px;
        margin-left: 14px;
      "
    >
      Dhoom 3
    </div>
    <div
      style="
        font-family: 'Yusei Magic', sans-serif;
        color: #fefeff;
        text-decoration: bold;
        font-size: 20px;
        margin-left: 35px;
      "
    >
      by: Rajkumar Hirani
    </div>
  </div>
  <div
    style="
      width: 15%;
      color: #e74f4f;
      font-size: 45px;
      text-align: center;
      margin-top: 40px;
    "
  >
    99%
  </div>
  <div style="width: 30%">
    <div
      style="
        font-family: 'Hachi Maru Pop', cursive;
        color: #fefeff;
        text-decoration: bold;
        font-size: 80px;
        margin-left: 5px;
      "
    >
      8.5
    </div>
    <div
      style="
        font-family: 'Yusei Magic', sans-serif;
        color: #fefeff;
        text-decoration: bold;
        font-size: 20px;
        margin-left: 35px;
      "
    >
      by: Rajkumar Hirani
    </div>
  </div>
</div>
</body> */

export default MovieItem;