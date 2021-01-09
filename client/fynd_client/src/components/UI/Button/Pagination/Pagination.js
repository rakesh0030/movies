import styles from './Pagination.module.css';

function Pagination(props) {
  return (
    <div className={`${styles.Pagination} col s5`}>
      <button class="waves-effect waves-light btn col s2 material-icons btn-floating"
      onClick={()=>props.onClickHandler("previous")}
      >navigate_before</button>
      <div class="col s1"></div>
      <button class="waves-effect waves-light col s2 btn material-icons btn-floating"
      onClick={()=>props.onClickHandler("next")}
      >navigate_next</button>
    </div>
  );
}

export default Pagination;