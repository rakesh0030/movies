import styles from './Tags.module.css';

function Tags(props) {
  let addClickedBackground = props.addClickedBackground ?  styles.TagSelected : "#c8e6c9 green lighten-4";
  return (

    <li className={`${styles.Tags} col s5 chip center  ${addClickedBackground}`} 
    onClick={()=>props.onGenreClicked(props.Tag)}
    
    >
      {props.Tag}
    </li>
  );
}

export default Tags;