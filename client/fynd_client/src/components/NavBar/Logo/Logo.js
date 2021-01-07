import styles from './Logo.module.css';

function Logo() {
  return (
    <div className={styles.Logo}>
      <img src="./movieLogo.png" alt="Logo"></img>
    </div>
  );
}

export default Logo;