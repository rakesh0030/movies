import styles from './Tags.module.css';

function Tags(props) {
  let addClickedBackground = props.addClickedBackground ? "##64dd17 light-green accent-4"  : styles.TagSelected;
  return (

    <li className={`${styles.Tags} chip  ${addClickedBackground}`} style={{color:"white",fontWeight:"bold"}} 
    onClick={()=>props.onGenreClicked(props.Tag)}
    
    >
      {props.Tag}
    </li>
  );
}

export default Tags;