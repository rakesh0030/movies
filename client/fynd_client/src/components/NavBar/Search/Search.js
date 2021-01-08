import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import styles from './Search.module.css';
import Suggestion from './Suggestion/Suggestion';

function Search(props) {

  

  //TODO : On change of text in input the size changes make it contant somehow.
  return (
    <>
    <div className={styles.Search}>
      {/* <Input className={styles.Input} placeholder="Enter Search Term" 
      onInputChange={props.onSearchInputChange}
      InputValue={props.suggestion.suggestionText}
      /> */}
      
        <div class="row">
          <div class="col s12">
              <div class="input-field col s9">
                <i class="material-icons prefix">search</i>
                <input type="text" id="autocomplete-input" className={`${styles.Autocomplete}` }
                onChange={(e)=>props.onSearchInputChange(e)}
                value={props.suggestion.suggestionText}
                />
                <label for="autocomplete-input">Enter Movie/Director Name</label>
              </div>
              <div className="col s3">
                <Button
                  btnText="Search"
                  onClickHandler={props.onSearchBtnClicked}
                />
              </div>
          </div>
          <div className="col s1">
          </div>
          <div className="col s9">
          <Suggestion {...props}/>
          </div>
          
        </div>
    </div>
    
    </>
  );
}

export default Search;