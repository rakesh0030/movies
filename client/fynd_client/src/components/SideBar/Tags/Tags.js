import styles from './Tags.module.css';

function Tags(props) {
  let addClickedBackground = props.addClickedBackground ?  styles.TagSelected : "";
  return (

    <li className={`${styles.Tags} ${addClickedBackground}`} 
    onClick={()=>props.onGenreClicked(props.Tag)}
    
    >
      {props.Tag}
    </li>
  );
}

export default Tags;