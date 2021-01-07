import styles from './Login.module.css';

function Login(props) {
  //TODO : Currently directly adding input here copied from B-social app
  //Later might change this to come from INput in UI folder.
  return (
    <div className={styles.Login}>
      <div className={styles.loginCard}>
      <div className="card">
        <div className="card-content center">
          <span className="card-title">Please Sign In</span>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input id="name" type="text"
            value={props.admin.name}
            onChange={(e)=>props.setname(e.target.value)}
            ></input>
            <label for="name">Name</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input id="password" type="password" className="validate"
            value={props.admin.password}
            onChange={(e)=>props.setPassword(e.target.value)}
            ></input>
            <label for="password">Password</label>
          </div>
        </div>
        <div className="card-action center">
          <button className="btn waves-effect waves-light #455a64 blue-grey darken-2" type="submit" name="action"
          onClick={()=>props.loginReq()}
          >Log In
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;