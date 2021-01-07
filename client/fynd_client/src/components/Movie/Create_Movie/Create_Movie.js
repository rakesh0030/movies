import styles from './Create_Movie.module.css';

function Create_Movie(props) {
  //TODO : Currently directly adding input here copied from B-social app
  //Later might change this to come from INput in UI folder.

  //TODO : Change all default values when edit is present.

  //TODO : Add genre multiselect dynamic.

  //TODO : Add multiple select from dropdown component and not directly.

  //TODO : Add multi-select genre value getter in variable.

  let genresDropdown = null;

  if(props.Tags && props.Tags.length > 0){
    genresDropdown = props.Tags.map((e)=>{
      return <option value={e.genreName}>{e.genreName}</option>
    })
  }

  return(
    <div className={styles.Create_Movie}>
      <div className={styles.Create_Movie}>
      <div className="card">
        <div className="card-content center">
          <span className="card-title">Add Movie Details</span>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input id="movie_name" type="text"
            value={props.MovieEditCreate.name}
            onChange={(e)=>props.setMovieName(e.target.value)}
            ></input>
            <label for="movie_name">Movie-Name</label>
          </div>
        </div>
        {/* TODO check why below Director input not working*/}
        <div className="row">
          <div className="input-field col s12">
            <input id="diretor_name" type="text"
            value={props.MovieEditCreate.director}
            onChange={(e)=>props.setDirectorName(e.target.value)}
            ></input>
            <label for="director_name">Director-Name</label>
          </div>
        </div>
        {/* TODO : Look how to show these range value on selection */}
        <div className="row">
        <p class="range-field col s12">
          <label for="imdb_score">imdb-score</label>
          <input type="range" id="imdb_score" min="0" max="10"
          onChange={(e)=>props.setIMDBScore(e.target.value)}
          />
        </p>
        </div>
        <div className="row">
        <p class="range-field col s12">
          <label for="99popularity">99popularity</label>
          <input type="range" id="99popularity" min="0" max="99"
          //  TODO:check max value for 99popularity
          onChange={(e)=>props.set99popularity(e.target.value)}
          />
        </p>
        </div>
        <div class="input-field col s12">
          <select multiple>
            <option value="" disabled selected>Choose your option</option>
            {/* <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option> */}
            {genresDropdown}
          </select>
          <label>Materialize Multiple Select</label>
        </div>
        
        <div className="card-action center">
          <button className="btn waves-effect waves-light #455a64 blue-grey darken-2" type="submit" name="action"
          onClick={()=>props.createMovie()}
          >Add Movie
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Create_Movie;