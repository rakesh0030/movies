import Links from './Links/Links';
import Logo from './Logo/Logo';
import styles from './NavBar.module.css';
import Search from './Search/Search';

function NavBar(props) {
  return (
    <div className={styles.NavBar}>
      <Logo {...props}/>
      <Search {...props}/>
      <Links {...props}/>
    </div>
  );
}

export default NavBar;