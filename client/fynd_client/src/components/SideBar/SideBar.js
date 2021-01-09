import styles from './SideBar.module.css';
import Tags from './Tags/Tags';

function SideBar(props) {

  console.log("SideBar props is",props);

  let TagArr = null;
  if(props.Tags && props.Tags.length > 0){
    TagArr = props.Tags.map((e)=>{
      return (<Tags 
        class={styles.Tag} 
        Tag={e.genreName} 
      onGenreClicked={props.onGenreClicked}
      addClickedBackground={props.searchCriteria.genre.includes(e.genreName)}
      />)
    })
  }

  console.log("props.Tags is",props.Tags);
  console.log("TagArr is",TagArr);

  return (  
  <div class={`col s3 ${styles.SideBar}`}>
    <div class="card">
      <ul class={`card-content ${styles.Tags}`}>
        <div class="row">
          {TagArr}
        </div>
      </ul>
    </div>
  </div>
          
  );
}

export default SideBar;

  
        