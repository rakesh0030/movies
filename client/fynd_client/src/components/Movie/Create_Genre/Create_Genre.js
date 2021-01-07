import styles from './Create_Genre.module.css';

function Create_Genre(props) {
  //TODO : Currently directly adding input here copied from B-social app
  //Later might change this to come from INput in UI folder.

  //TODO : Change all default values when edit is present.

  //TODO : Add genre multiselect dynamic.

  //TODO : Add multiple select from dropdown component and not directly.

  //TODO : Add multi-select genre value getter in variable.

  return(
    <div className={styles.Create_Genre}>
      <div className={styles.Create_Genre}>
      <div className="card">
        <div className="card-content center">
          <span className="card-title">Add Genre</span>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input id="genre_name" type="text"
            value={props.genreCreate}
            onChange={(e)=>props.setGenreName(e.target.value)}
            ></input>
            <label for="genre_name">Genre-Name</label>
          </div>
        </div>
        <div className="card-action center">
          <button className="btn waves-effect waves-light #455a64 blue-grey darken-2" type="submit" name="action"
          onClick={()=>props.createGenre()}
          >Add Genre
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Create_Genre;