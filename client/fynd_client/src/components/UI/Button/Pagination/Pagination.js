import styles from './Pagination.module.css';

function Pagination(props) {
  return (
    <div className={styles.Pagination}>
      <button class="waves-effect waves-light btn"
      onClick={()=>props.onClickHandler("previous")}
      >previous</button>
      <button class="waves-effect waves-light btn"
      onClick={()=>props.onClickHandler("next")}
      >next</button>
    </div>
  );
}

export default Pagination;