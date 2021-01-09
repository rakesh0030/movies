import styles from './Logo.module.css';

function Logo(props) {
  return (
    <div className={`${styles.Logo} tooltipped`} data-position="right" data-tooltip="Home">
      <img  src="./movieLogo.png" alt="Logo" onClick={()=>props.onLogoClicked()} ></img>
    </div>
  );
}

export default Logo;