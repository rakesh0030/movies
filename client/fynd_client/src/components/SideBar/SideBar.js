import styles from './SideBar.module.css';
import Tags from './Tags/Tags';

function SideBar(props) {

  console.log("SideBar props is",props);

  let TagArr = null;
  if(props.Tags && props.Tags.length > 0){
    TagArr = props.Tags.map((e)=>{
      return <Tags class={styles.Tag} Tag={e.genreName} 
      onGenreClicked={props.onGenreClicked}
      addClickedBackground={props.searchCriteria.genres.includes(e.genreName)}
      />
    })
  }

  console.log("props.Tags is",props.Tags);
  console.log("TagArr is",TagArr);

  return (  
  <div class={`row ${styles.SideBar}`}>
  <div class="col s12 m2">
    <div class="card">
      <ul class={`card-content ${styles.Tags}`}>
          {TagArr}
      </ul>
    </div>
  </div>
</div>
          
  );
}

export default SideBar;

  
        