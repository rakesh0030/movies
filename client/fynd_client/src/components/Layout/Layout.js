import NavBar from '../NavBar/NavBar';
import SideBar from '../SideBar/SideBar';
import styles from './Layout.module.css';
import Movie from '../Movie/Movie';
import Dropdown from '../UI/Dropdown/Dropdown';
import Pagination from '../UI/Button/Pagination/Pagination';
import Login from '../Auth/Login/Login';
import Button from '../UI/Button/Button';
import Create_Movie from '../Movie/Create_Movie/Create_Movie';
import Create_Genre from '../Movie/Create_Genre/Create_Genre';
import SignUp from '../Auth/SignUp/SignUp';

function Layout(props) {
  //Currently doing directly later may add react routing
  let mainContent = (
    // <div className={styles.MainContent}>
    <div >
      <div className="row">
        <SideBar {...props}/>
        <div className="col s9">
        <div>
        <Dropdown {...props} onOptionsClicked={props.onSortOptionClicked}/>
        <div className="col s2"></div>
        <Pagination {...props} onClickHandler={props.onPaginationBtnClicked}/>
        </div>
        <Movie {...props}/>
        </div>
      </div>
    </div>
  );
  
  console.log("wether to show login screen",props.isLoginScreenOpen);

  if(props.isLoginScreenOpen){
    mainContent = <Login {...props}/>
  }

  if(props.isSignUpScreenOpen){
    mainContent = <SignUp {...props}/>
  }

  

  console.log("props in Lyout is",props);

  if(props.isMovieCreationScreenOpen){
    mainContent = <Create_Movie {...props}/>
  }

  if(props.isGenreCreationScreenOpen){
    mainContent = <Create_Genre {...props}/>
  }

  const jwt = localStorage.getItem("jwt");
  let AddMovieGenreBtns = null;
  console.log("jwt in Lyout is",jwt);
  if(jwt && !props.isMovieCreationScreenOpen && !props.isGenreCreationScreenOpen && !props.isSignUpScreenOpen){
    AddMovieGenreBtns = (
    <div className={`container ${styles.MovieGenreBtns}`}>
    <Button {...props} onClickHandler={props.onAddMovieGenreClicked} btnText="Add Movie"></Button>
    <Button {...props} onClickHandler={props.onAddGenreGenreClicked} btnText="Add Genre"></Button>
    <Button {...props} onClickHandler={props.onAddAdminClicked} btnText="Add Admin"></Button>
    </div>
    )
  }

  return (
    <div className={styles.Layout}>
      <NavBar {...props}>
      </NavBar>
      <div className={`${styles.MainContent}`}>
      {AddMovieGenreBtns}
      {mainContent}
      </div>
    </div>
  );
}

export default Layout;