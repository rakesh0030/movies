import styles from './Pagination.module.css';

function Pagination(props) {
  return (
    <div>
      <button className={`${styles.Pagination} waves-effect waves-light btn material-icons btn-floating`}
      onClick={()=>props.onClickHandler("previous")}
      >navigate_before</button>
      <button className={`${styles.Pagination} waves-effect waves-light btn material-icons btn-floating`}
      onClick={()=>props.onClickHandler("next")}
      >navigate_next</button>
    </div>
  );
}

export default Pagination;