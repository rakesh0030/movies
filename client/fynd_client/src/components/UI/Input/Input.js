import styles from './Input.module.css';

function Input(props) {
  return (
    <div>
    <input type="text" className={styles.Input} placeholder={props.placeholder} 
    onChange={(e)=>props.onInputChange(e)}
    value={props.InputValue}
    ></input>
    </div>
  )
}

export default Input;