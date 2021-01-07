import NavBar from '../NavBar/NavBar';
import SideBar from '../SideBar/SideBar';
import styles from './Layout.module.css';
import Movie from '../Movie/Movie';
import Dropdown from '../UI/Dropdown/Dropdown';

function Layout(props) {
  return (
    <div className={styles.Layout}>
      <NavBar {...props}>
      </NavBar>
      <div className={styles.MainContent}>
        <SideBar {...props}/>
        <Movie {...props}/>
        <Dropdown {...props}/>
      </div>
    </div>
  );
}

export default Layout;