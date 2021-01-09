import styles from './Button.module.css';

function Button(props) {
  return (
    <div className={`${styles.Button}`}>
      <button class="waves-effect waves-light btn-small #0277bd light-blue darken-3"
      onClick={()=>props.onClickHandler()}
      >{props.btnText}</button>
    </div>
  );
}

export default Button;