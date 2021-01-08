import styles from './Dropdown.module.css';

function Dropdown(props) {
  //TODO : make no option selected by default
  let options = null;
  if (props.sortableFields && props.sortableFields.length > 0) {
    options = props.sortableFields.map((s) => {
      return <option value={s} onClick={() => props.onOptionsClicked(s)}>{s}</option>
    })
  }
  console.log("props.onOptionsClicked ",props.onOptionsClicked);
  return (
    <div class="input-field col s5">
      <select className={`${styles.Dropdown}`}>
        <option value="" disabled selected>Choose your option</option>
        {options}
      </select>
      <label>Sort Select</label>
    </div>
  );
}

export default Dropdown;