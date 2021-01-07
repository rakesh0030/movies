import styles from './Button.module.css';

function Button(props) {
  return (
    <div className={styles.Button}>
      <button class="waves-effect waves-light btn"
      onClick={()=>props.onClickHandler()}
      >hadbhb</button>
    </div>
  );
}

export default Button;