import styles from './Dropdown.module.css';

function Dropdown(props) {
  //TODO : make no option selected by default
  let options = null;
  if(props.sortableFields && props.sortableFields.length > 0){
    options = props.sortableFields.map((s)=>{
      return <option>{s}</option>
    })
  }
  return (
    <select className={styles.Dropdown} name="sort" id="sort">
      {options}
    </select>
  );
}

export default Dropdown;