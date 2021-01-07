import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import styles from './Search.module.css';
import Suggestion from './Suggestion/Suggestion';

function Search(props) {

  


  return (
    <>
    <div className={styles.Search}>
      <Input className={styles.Input} placeholder="Enter Search Term" 
      onInputChange={props.onSearchInputChange}
      InputValue={props.suggestion.suggestionText}
      />
      <Button 
      onClickHandler={props.onSearchBtnClicked}
      />
      <Suggestion {...props}/>
    </div>
    
    </>
  );
}

export default Search;