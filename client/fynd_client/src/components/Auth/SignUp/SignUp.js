import styles from './SignUp.module.css';

function SignUp(props) {
  //TODO : Currently directly adding input here copied from B-social app
  //Later might change this to come from INput in UI folder.
  return (
    <div className={styles.SignUp}>
      <div className={styles.SignUpCard}>
      <div className="card">
        <div className="card-content center">
          <span className="card-title">Add detials for new admin</span>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input id="name" type="text"
            value={props.newAdmin.name}
            onChange={(e)=>props.setSignUpname(e.target.value)}
            ></input>
            <label for="name">Name</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input id="password" type="password" className="validate"
            value={props.newAdmin.password}
            onChange={(e)=>props.setSignUpPassword(e.target.value)}
            ></input>
            <label for="password">Password</label>
          </div>
        </div>
        <div className="card-action center">
          <button className={`${styles.Button} btn waves-effect waves-light #455a64 blue-grey darken-2`} type="submit" name="action"
          onClick={()=>props.SignUpReq()}
          >Sign Up
          </button>
          <button className="btn waves-effect waves-light #455a64 blue-grey darken-2" type="submit" name="action"
          onClick={()=>props.OnCancelSignUp()}
          >Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SignUp;