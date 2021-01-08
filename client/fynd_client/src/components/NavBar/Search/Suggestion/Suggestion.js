import styles from './Suggestion.module.css';

function Suggestion(props) {
  console.log(props.suggestion.suggestions.length);
  return (

    <div className={`${styles.Suggestion}`}>
      {
        props.suggestion.suggestions.length > 0 ? 
        <ul>
        {(props.suggestion.suggestions.map((suggestionText)=>{
          //TODO : Check how to distincguish between director and name in search suggestion
          return <li className={styles.SuggestionList} onClick={(e)=>props.onSearchSuggestionClicked(suggestionText)}>{suggestionText}</li>
        }))}
        </ul>
        :null
      }
    </div>
  );
}

export default Suggestion;