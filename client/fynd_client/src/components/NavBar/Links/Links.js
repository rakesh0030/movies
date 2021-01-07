import Link from './Link/Link';
import styles from './Links.module.css';

function Links(props) {
  let LinkItems = null;
  console.log(LinkItems,props.Links);
  LinkItems = props.Links.map((linkText)=>{
    return <Link linkText={linkText}/>
  })
  console.log(LinkItems,props.Links);
  


  return (
      <ul className={styles.Links}>
        {LinkItems}
        <Link linkText="DUMMY"/> 
        <Link linkText="DUMMY"/> 
      {/* Todo : remove above line */}
      </ul>
      
  );
}

export default Links;