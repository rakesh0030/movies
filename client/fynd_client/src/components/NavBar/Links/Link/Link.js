import styles from './Link.module.css';

function Link(props) {
  return (
    <li className={styles.Link}>
      {props.linkText}
    </li>
  );
}

export default Link;