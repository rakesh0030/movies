import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import styles from './Search.module.css';
import Suggestion from './Suggestion/Suggestion';

function Search(props) {

  //setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 5000;  //time in ms, 5 second for example

function onKeyUpFunc(e){
  console.log(" onKeyUpFunc function run");
  console.log("e is",e);
  clearTimeout(typingTimer);
  if(e.target.value){
  typingTimer = setTimeout(props.onSearchInputChange(e), doneTypingInterval);
  }
};

function onKeyDownFunc(e){
  console.log(" onKeyDownFunc function run");
  console.log("e is",e);
  clearTimeout(typingTimer);
};

  //TODO : On change of text in input the size changes make it contant somehow.
  return (
    <>
      <div className={styles.Search}>
        {/* <Input className={styles.Input} placeholder="Enter Search Term" 
      onInputChange={props.onSearchInputChange}
      InputValue={props.suggestion.suggestionText}
      /> */}

        <div class={`${styles.Autocomplete} row`} >
          <div class="col s12">
            <div class="input-field col s9">
              <i class="material-icons prefix">search</i>
              <input type="text" id="autocomplete-input"
                onKeyUp={function (e){  console.log("inside");onKeyUpFunc(e);}}
                onKeyDown={function (e){  onKeyDownFunc(e)}}
                onChange={(e)=>{props.syncSearchInputWithState(e)}}
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
            <Suggestion {...props} />
          </div>

        </div>
      </div>

    </>
  );
}

export default Search;