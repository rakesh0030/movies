import Link from './Link/Link';
import styles from './Links.module.css';

function Links(props) {
  let LinkItems = null;
  console.log(LinkItems,props.Links);
  LinkItems = props.Links.map((linkText)=>{
    return <Link linkText={linkText} {...props}/>
  })
  console.log(LinkItems,props.Links);
  


  return (
      <ul className={styles.Links}>
        {LinkItems}
      </ul>
      
  );
}

export default Links;