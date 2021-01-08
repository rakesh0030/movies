import styles from './Link.module.css';

function Link(props) {
  return (
    //TODO : Currently only single link directly attaching a onCLick may change later.
    <li className={`${styles.Link} waves-effect waves-light btn`} onClick={()=>props.adminLinkBtnClickhandler()}>
      {props.linkText}
    </li>
  );
}

export default Link;