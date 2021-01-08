import styles from './Pagination.module.css';

function Pagination(props) {
  return (
    <div className={`${styles.Pagination} col s5`}>
      <button class="waves-effect waves-light btn col s5"
      onClick={()=>props.onClickHandler("previous")}
      >previous</button>
      <div class="col s2"></div>
      <button class="waves-effect waves-light btn col s5"
      onClick={()=>props.onClickHandler("next")}
      >next</button>
    </div>
  );
}

export default Pagination;