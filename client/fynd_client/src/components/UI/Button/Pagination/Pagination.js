import styles from './Pagination.module.css';

function Pagination(props) {
  return (
    <div className={`${styles.Pagination} col s5`}>
      <button class="waves-effect waves-light btn col s5 material-icons"
      onClick={()=>props.onClickHandler("previous")}
      >navigate_before</button>
      <div class="col s2"></div>
      <button class="waves-effect waves-light col s5 btn material-icons"
      onClick={()=>props.onClickHandler("next")}
      >navigate_next</button>
    </div>
  );
}

export default Pagination;