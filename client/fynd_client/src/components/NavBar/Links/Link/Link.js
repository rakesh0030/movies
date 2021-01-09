import styles from './Link.module.css';

function Link(props) {
  console.log("props as in links is",props);
  return (
    //TODO : Currently only single link directly attaching a onCLick may change later.
    <li className={`${styles.Link} waves-effect waves-light btn-small #0277bd light-blue darken-3`} onClick={()=>props.onClickHandler()}>
      {props.linkText}
    </li>
  );
}

export default Link;