import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import styles from './Search.module.css';
import Suggestion from './Suggestion/Suggestion';

function Search(props) {

  


  return (
    <>
    <div className={styles.Search}>
      {/* <Input className={styles.Input} placeholder="Enter Search Term" 
      onInputChange={props.onSearchInputChange}
      InputValue={props.suggestion.suggestionText}
      /> */}
      
        <div class="row">
        <div class="col s12">
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">search</i>
              <input type="text" id="autocomplete-input" class="autocomplete"
              onChange={(e)=>props.onSearchInputChange(e)}
              value={props.suggestion.suggestionText}
              />
                <label for="autocomplete-input">Enter Search Term</label>
            </div>
            </div>
          </div>
        </div>
        
      <Button 
      onClickHandler={props.onSearchBtnClicked}
      />
      <Suggestion {...props}/>
    </div>
    
    </>
  );
}

export default Search;