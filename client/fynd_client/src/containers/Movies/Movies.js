import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import './Movies.module.css';
import Tags from '../../components/SideBar/Tags/Tags';
import M from 'materialize-css';

class Movies extends Component {
  state = {
    suggestion: {
      suggestions : [],
      suggestionText: ""
    },
    Links : ["Admin Login"],
    Tags : [],
    MovieList : [],
    searchCriteria : {
      sort : null,
      genre : [],
      searchText : "",
      //TODO : Provide disbale/enable to next and previous btn.
      size : 10,
      from : 0
    },
    //TODO : add sortable field with a description which will be displayedd rather the
    //field name. 
    sortableFields : ["name", "director", "99popularity","imdb_score"],
    /*
    admin : {
      _id, name (in state always)
      name,password(only when sign in form is shown)
    }
    */
    admin : {
      _id : "",
      name : "",
      password : ""
    },
    newAdmin : {
      name : "",
      password : ""
    },
    //TODO : Might change later this so that we don't require below field but currently
    //using it to identify on which screen we are
    isLoginScreenOpen : false,
    isSignUpScreenOpen : false,
    isMovieCreationScreenOpen : false,
    isGenreCreationScreenOpen : false,
    /*
    MovieEditCreate : {
      _id : null(if post request, otherwise for put have some value),
      name : "",
      director : "",
      99popularity : (float)(Make a range selector from 0 to 10)
      imdb : (float)(Make a range selector from 0 to 10)
      genre : [](Make a multiselect dropdown)
    }
    */
    MovieEditCreate : {
      _id : null,
      name : "",
      director : "",
      "99popularity" : 0,
      imdb_score : 0,
      genre : ["Drama"]
    },
    genreCreate : ""
  }

  onLogoClicked = ()=>{
    this.setState({
      suggestion: {
        suggestions : [],
        suggestionText: ""
      },
      searchCriteria : {
        sort : null,
        genre : [],
        searchText : "",
        size : 10,
        from : 0
      },
      sortableFields : ["name", "director", "99popularity","imdb_score"],
      admin : {
        _id : "",
        name : "",
        password : ""
      },
      newAdmin : {
        name : "",
        password : ""
      },
      isLoginScreenOpen : false,
      isSignUpScreenOpen : false,
      isMovieCreationScreenOpen : false,
      isGenreCreationScreenOpen : false,
      MovieEditCreate : {
        _id : null,
        name : "",
        director : "",
        "99popularity" : 0,
        imdb_score : 0,
        genre : ["Drama"]
      },
      genreCreate : ""
    })
  }

  syncSearchInputWithState = (e)=>{
    let value = e.target.value;
    this.setState({
      suggestion: {
        suggestionText: value,
        suggestions: []
      }
    })
  }

  setGenreName = (e)=>{
    this.setState({
      genreCreate : e
    })
  }

  OnCancelAddMovie = (e) =>{
    this.setState({
      isMovieCreationScreenOpen : false,
      MovieEditCreate : {
        _id : null,
        name : "",
        director : "",
        "99popularity" : 0,
        imdb_score : 0,
        genre : ["Drama"]
      }
    })
  }

  OnCancelAddGenre = (e) =>{
    this.setState({
      isGenreCreationScreenOpen : false
    })
  }

  OnCancelLogin = ()=>{
    this.setState({
      isLoginScreenOpen : false
    })
  }

  OnCancelSignUp = ()=>{
    this.setState({
      isSignUpScreenOpen : false
    })
  }


  setMovieName = (e)=>{
    this.setState((oldState)=>{
      return {
        MovieEditCreate : {
          ...oldState.MovieEditCreate,
          name : e
        }
      }
    })
  }

  onMultiGenreClicked = () =>{
    var elem = document.getElementsByClassName("MultiSelectGenre");
    console.log("elem",elem);
    var instance = M.FormSelect.getInstance(elem[0]);
    console.log("instance",instance);
    var e = instance.getSelectedValues();
    console.log("e",e);
    console.log("onMultiGenreClicked value is",e);
    this.setState((oldState)=>{
      return {
        MovieEditCreate : {
          ...oldState.MovieEditCreate,
          genre : e
        }
      }
    })
  }

  setDirectorName = (e)=>{
    this.setState((oldState)=>{
      return {
        MovieEditCreate : {
          ...oldState.MovieEditCreate,
          director : e
        }
      }
    })
  }

  setIMDBScore = (e)=>{
    this.setState((oldState)=>{
      return {
        MovieEditCreate : {
          ...oldState.MovieEditCreate,
          imdb_score : parseFloat(e)
        }
      }
    })
  }

  set99popularity = (e)=>{
    this.setState((oldState)=>{
      return {
        MovieEditCreate : {
          ...oldState.MovieEditCreate,
          "99popularity" : parseInt(e)
        }
      }
    })
  }

  createMovie = () => {
    let options = {
      headers: {
        'Authorization': localStorage.getItem("jwt")
      }
    }
    let requestObj = { ...this.state.MovieEditCreate }
    delete requestObj._id;
    if(this.state.MovieEditCreate._id){
      return axios.put("/movies", requestObj, options)
      .then((r) => {
        M.toast({ html: `movie created successfully.`, classes: "#2e7d32 green darken-3" });
        this.setState({
          isMovieCreationScreenOpen : false
        })
      })
      .catch((err) => {
        console.log("Error is ", err);
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
    }
    return axios.post("/movies", requestObj, options)
      .then((r) => {
        M.toast({ html: `movie created successfully.`, classes: "#2e7d32 green darken-3" });
        this.setState({
          isMovieCreationScreenOpen : false
        })
      })
      .catch((err) => {
        console.log("Error is ", err.response);
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
  }

  createGenre = () => {
    let options = {
      headers: {
        'Authorization': localStorage.getItem("jwt")
      }
    }
    let newGenre = this.state.genreCreate;
    let requestObj = {genre : this.state.genreCreate}
    return axios.post("/genres", requestObj, options)
      .then((r) => {
        M.toast({ html: `Genre created successfully.`, classes: "#2e7d32 green darken-3" });
        this.setState((oldState)=>{
          return{
          isGenreCreationScreenOpen : false,
          from : 0
          }
        },()=>{
          this.onSearchBtnClicked();
        })
      })
      .catch((err) => {
        console.log("Error is ", err);
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
  }

  onAddMovieGenreClicked = ()=>{
    this.setState({
      isMovieCreationScreenOpen : true
    },()=>{
      var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    })
    
  }

  onAddGenreGenreClicked = ()=>{
    this.setState({
      isGenreCreationScreenOpen : true
    })
  }

  onSearchInputChange = (e)=>{
    const value = e.target.value;
    if(value.length == 0){
      this.setState({
        suggestion : {
          suggestionText: value,
          suggestions : []
        }
      })
    }
    else{
      axios.get(`/movies/search/${value}`)
        .then((r)=>{
          const resp = r.data.data;
          console.log("Response is",resp);
          const suggArr = resp.map((m)=>{
            return `${m.name}`;
          })
          this.setState({
            suggestion: {
              suggestionText: value,
              suggestions: suggArr
            }
          }, () => {
            let suggestionArray = this.state.suggestion.suggestions;
            let suggestionObj = suggestionArray.map((e,idx) => {
              return {
                [e]: null
              }
            })
            console.log("suggestionObject is", suggestionObj)
          })
        })
        .catch((e)=>{
          M.toast({ html: `Error in fetching suggestions ${e.response.data.message}`, classes: "#ff1744 red accent-3" })
        })
    }
    console.log(this.state);
  }

  onSearchSuggestionClicked = (value) => {
    console.log("clicked suggestion");
    this.setState((oldState)=>{
      return {
      suggestion : {
        suggestionText: value,
        suggestions : []
      },
      searchCriteria : {
        ...oldState.searchCriteria,
        searchText : value
      }
    }})
  }

  onSearchBtnClicked = () =>{
    let postObj = {
      ...this.state.searchCriteria,
      searchText : this.state.suggestion.suggestionText
    }
    let searchCriteria = this.state.searchCriteria;
    let queryString = Object.keys(searchCriteria).map(key => key + '=' + (searchCriteria[key] ? searchCriteria[key] : "")).join('&');
    console.log(queryString);
    const jwt = localStorage.getItem("jwt");
    let options = null;
    if(jwt){
    options = {
      headers: {
        'Authorization':  jwt
      }
    }}
    axios.get(`/movies?${queryString}`,options)
      .then((r)=>{
        this.setState({
          MovieList : r.data.data
        })
      })
      .catch((e)=>{
        console.log("error is",e);
        M.toast({ html: `Error in getting movie list after searching ${e.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
  }

  onGenreClicked = (value) => {
    console.log(value);
    if (!this.state.searchCriteria.genre.includes(value)) {
      this.setState((oldState) => {
        let genre = [...oldState.searchCriteria.genre, value];
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            from : 0,
            genre
          }
        };
      },
      this.onSearchBtnClicked
      )
    }
    else{
      let idx = this.state.searchCriteria.genre.indexOf(value);
      this.state.searchCriteria.genre.splice(idx,1);
      let genre = this.state.searchCriteria.genre;
      this.setState((oldState) => {
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            genre,
            from : 0
          }
        };
      },
      this.onSearchBtnClicked)
    }
  }

  onSortOptionClicked = (value)=>{
    console.log("onSoetOptionClciked called");
    if(value.length > 0){
      this.setState((oldState) => {
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            sort : value,
            from : 0
          }
        };
      },
      this.onSearchBtnClicked)
    }
  }

  onPaginationBtnClicked = (value) =>{
    if(value == "next"){
      this.setState((oldState) => {
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            from : oldState.searchCriteria.from + oldState.searchCriteria.size
          }
        };
      },
        this.onSearchBtnClicked
      )
    }
    else{
      this.setState((oldState) => {
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            from : oldState.searchCriteria.from - oldState.searchCriteria.size
          }
        };
      },
        this.onSearchBtnClicked
      )
    }
  }

  setname = (value)=>{
    this.setState((oldState)=>{
      return {
        admin :{
          ...oldState.admin,
          name : value
        }
      }
    })
  }

  setPassword = (value)=>{
    this.setState((oldState)=>{
      return {
        admin :{
          ...oldState.admin,
          password : value
        }
      }
    })
  }

  setSignUpPassword = (value)=>{
    this.setState((oldState)=>{
      return {
        newAdmin :{
          ...oldState.newAdmin,
          password : value
        }
      }
    })
  }

  setSignUpname = (value)=>{
    this.setState((oldState)=>{
      return {
        newAdmin :{
          ...oldState.newAdmin,
          name : value
        }
      }
    })
  }

  onAddAdminClicked = ()=>{
    this.setState({
      isSignUpScreenOpen : true
    })
  }

  onLogOutClicked = ()=>{
    console.log("Log out clicked");
    localStorage.removeItem("jwt");
    localStorage.removeItem("admin");
    this.setState((oldState)=>{
      let oldMovieList = oldState.MovieList;
      for(let i=0;i<oldMovieList.length;i++){
        oldMovieList[i].isModificationAllowed = false;
      }
      return{
      isGenreCreationScreenOpen : false,
      isLoginScreenOpen : false,
      isMovieCreationScreenOpen : false,
      Links :["Admin Login"],
      MovieList :oldMovieList
      }
    })
  }

  loginReq = ()=>{
    console.log("Login Request made");
    const postData = {
      name : this.state.admin.name,password : this.state.admin.password
    };
    console.log("Post Data for login",postData);
    axios.post('/auth/login',postData)
      .then((res)=>{
        M.toast({html: 'Login successful', classes:"#2e7d32 green darken-3"})
        console.log('Response is',res);
        console.log(res.data.data.token);
        localStorage.setItem("jwt",res.data.data.token);
        localStorage.setItem("admin",JSON.stringify(res.data.data.adminDetails));
        let admin = res.data.data.adminDetails;
        this.setState({
          isLoginScreenOpen : false,
          Links : ["Log Out"],
          from : 0
        },()=>{
          this.onSearchBtnClicked();
        })
      })
      .catch((err)=>{
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
  }

  SignUpReq = ()=>{
    console.log("SignUp Request made");
    const postData = {
      name : this.state.newAdmin.name,password : this.state.newAdmin.password
    };
    let options = {
      headers: {
        'Authorization': localStorage.getItem("jwt")
      }
    }
    console.log("Post Data for signup",postData);
    axios.post('/auth/signup',postData,options)
      .then((res)=>{
        M.toast({html: 'Admin added.', classes:"#2e7d32 green darken-3"})
        console.log('Response is',res);
        console.log(res.data.data.token);
        this.setState({
          isSignUpScreenOpen : false
        })
      })
      .catch((err)=>{
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
  }
  
  adminLinkBtnClickhandler = ()=>{
    console.log("admin btn clicked");
    this.setState({
      isLoginScreenOpen : true
    })
  } 

  onDeleteSpanClickHandler = (movieID) =>{
    const jwt = localStorage.getItem("jwt");
    if(!jwt){
      M.toast({html : 'Please login as admin first.', classes:"#ff1744 red accent-3"});
      return;
    }
    if(!window.confirm("Are you sure to delete?")){
      return;
    }
    let options = {
      headers: {
        'Authorization':  jwt
      }
    }
    axios.delete(`/movies/${movieID}`,options)
      .then((r)=>{
        console.log(r)
        this.setState((oldState) => {
          let idx;
          let MovieList = oldState.MovieList;
          MovieList.forEach((movie, movieIDx) => {
            if (movieID != movie._id) {
              idx = movieIDx;
            }
          });
          console.log("idx is", idx);
          MovieList.splice(idx, 1);
          M.toast({ html: "movie Deleted successfully", classes: "#2e7d32 green darken-3" });
          return {
            MovieList
          }
        })
      })
      .catch((e)=>{
        console.log(e);
        M.toast({html : 'Unable to delete post.', classes:"#ff1744 red accent-3"});
      })
  }

  onEditSpanClickHandler = (movie)=>{
    console.log("Movie to be edited",movie);
    //Removing all white spaces form genre of movie that need to be edited.
    for(let i=0;i<movie.genre.length;i++){
        movie.genre[i] = movie.genre[i].trim();
    }
    this.setState({
      MovieEditCreate : movie,
      isMovieCreationScreenOpen : true
    },()=>{
      var multiSelect = document.getElementById("MultiSelectGenre");
      console.log("Genre to be added",this.state.MovieEditCreate.genre)
      for (var i = 0; i < multiSelect.options.length; i++) {
        console.log("option is",(multiSelect.options[i].value));
        console.log("Movie Edit create",this.state.MovieEditCreate.genre)
        let currGenreValue = multiSelect.options[i].value;
        
        multiSelect.options[i].selected = this.state.MovieEditCreate.genre.indexOf(currGenreValue) >= 0;
        console.log("option selected : ",multiSelect.options[i].selected);
      }
      M.updateTextFields();
    })
  }

  componentDidMount(){
    axios.get('/genres')
      .then((r)=>{
        console.log("Genres are ",r);
        this.setState({
          Tags : r.data.data
        })
      })
      .catch((e)=>{
        console.log("error is",e);
        M.toast({ html: `Error in getting tags ${e.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
    let searchCriteria = this.state.searchCriteria;
    let queryString = Object.keys(searchCriteria).map(key => key + '=' + (searchCriteria[key] ? searchCriteria[key] : "")).join('&');
    console.log(queryString);
    const jwt = localStorage.getItem("jwt");
    let options = null;
    if(jwt){
    options = {
      headers: {
        'Authorization':  jwt
      }
    }}
    axios.get(`/movies?${queryString}`,options)
      .then((r)=>{
        this.setState({
          MovieList : r.data.data
        })
      })
      .catch((e)=>{
        console.log("error is",e);
      })

    if(jwt){
      this.setState({
        Links : ["Log Out"]
      })
    }

    document.addEventListener('DOMContentLoaded',  ()=> {
      var elems = document.querySelectorAll('select');
      var instances = M.FormSelect.init(elems);
      var Autoelems = document.querySelectorAll('.autocomplete');
      let suggestionArray = this.state.suggestion.suggestions;
      let suggestionObj = suggestionArray.map((e)=>{
        return {
          [e] : null
        }
      })
      var Tooltipelems = document.querySelectorAll('.tooltipped');
      var instances = M.Tooltip.init(Tooltipelems);
      console.log("suggestionObject is",suggestionObj)
      var AutoInstances = M.Autocomplete.init(Autoelems, 
        {minLength: 1});

        var Inputelems  = document.querySelectorAll("input[type=range]");
        M.Range.init(Inputelems);
    });
  }

  componentDidUpdate = ()=>{
    var elems2 = document.querySelectorAll('select');
    var instances2 = M.FormSelect.init(elems2);
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    M.updateTextFields();
  }



  render() {
    console.log("State is",this.state);
    return (
      <div className="Movies">
        <Layout 
        suggestion={this.state.suggestion} 
        onSearchInputChange={this.onSearchInputChange} 
        Links={this.state.Links}
        Tags = {this.state.Tags} 
        MovieList={this.state.MovieList}
        onSearchSuggestionClicked = {this.onSearchSuggestionClicked}
        onGenreClicked = {this.onGenreClicked}
        searchCriteria = {this.state.searchCriteria}
        sortableFields = {this.state.sortableFields}
        onSearchBtnClicked = {this.onSearchBtnClicked}
        onSortOptionClicked = {this.onSortOptionClicked}
        onPaginationBtnClicked = {this.onPaginationBtnClicked}
        setname = {this.setname}
        setPassword = {this.setPassword}
        loginReq = {this.loginReq}
        admin = {this.state.admin}
        isLoginScreenOpen = {this.state.isLoginScreenOpen}
        isGenreCreationScreenOpen = {this.state.isGenreCreationScreenOpen}
        isMovieCreationScreenOpen = {this.state.isMovieCreationScreenOpen}
        adminLinkBtnClickhandler = {this.adminLinkBtnClickhandler}
        onDeleteSpanClickHandler = {this.onDeleteSpanClickHandler}
        onAddMovieGenreClicked = {this.onAddMovieGenreClicked}
        onAddGenreGenreClicked = {this.onAddGenreGenreClicked}
        MovieEditCreate = {this.state.MovieEditCreate}
        setMovieName = {this.setMovieName}
        setDirectorName = {this.setDirectorName}
        setIMDBScore = {this.setIMDBScore}
        set99popularity = {this.set99popularity}
        createMovie = {this.createMovie}
        setGenreName = {this.setGenreName}
        createGenre = {this.createGenre}
        onMultiGenreClicked = {this.onMultiGenreClicked}
        onEditSpanClickHandler = {this.onEditSpanClickHandler}
        OnCancelAddMovie = {this.OnCancelAddMovie}
        OnCancelAddGenre = {this.OnCancelAddGenre}
        OnCancelLogin = {this.OnCancelLogin}
        syncSearchInputWithState = {this.syncSearchInputWithState}
        SignUpReq = {this.SignUpReq}
        OnCancelSignUp = {this.OnCancelSignUp}
        onAddAdminClicked = {this.onAddAdminClicked}
        isSignUpScreenOpen ={this.state.isSignUpScreenOpen}
        setSignUpname = {this.setSignUpname}
        newAdmin = {this.state.newAdmin}
        setSignUpPassword = {this.setSignUpPassword}
        onLogOutClicked = {this.onLogOutClicked}
        onLogoClicked = {this.onLogoClicked}
        />
      </div>
    );
  }
}

export default Movies;
