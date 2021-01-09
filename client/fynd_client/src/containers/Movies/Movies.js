import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import './Movies.module.css';
import Tags from '../../components/SideBar/Tags/Tags';
import M from 'materialize-css';

class Movies extends Component {
  state = {
    suggestion: {
      //sitems: ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"], //Array having suggestions,
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
      //TODO : Currently not making next an previous disabled but will later do.
      size : 10,
      from : 0
    },
    //TODO : now adding blank in beginning just to make sure that none is chosen by default.
    //TODO: Later define a api for getting sortable fields.
    //TODO: Also add later label and other tags for select.

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
      //TODO : this is imdb_score not imdb change everywhere.
      imdb_score : 0,
      genre : ["Drama"] //TODO : Remove this dummy genre,created because we need atleast one genre
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
        //items : ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"],
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
      isMovieCreationScreenOpen : false
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
    // console.log("onMultiGenreClicked value is",e);
    // this.setState((oldState)=>{
    //   return {
    //     MovieEditCreate : {
    //       ...oldState.MovieEditCreate,
    //       genre : [...oldState.MovieEditCreate.genre,e]
    //     }
    //   }
    // })

    //TODO : Replace all var to let
    //TODO : Make this a method and use here.
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
          imdb_score : parseInt(e)
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
    //TODO : Later change how to make sure we are editing or 
    //creating a new movie.
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
    //TODO : Check wether we are making a duplicate genre if yes then do not make
    //TODO : On client side check using Tag comparison
    //TODO : On server side also check
    let newGenre = this.state.genreCreate;
    let requestObj = {genre : this.state.genreCreate}
    return axios.post("/genres", requestObj, options)
      .then((r) => {
        M.toast({ html: `Genre created successfully.`, classes: "#2e7d32 green darken-3" });
        this.setState((oldState)=>{
          let Tags = oldState.Tags;
          Tags.push({genreName :newGenre, _id : r.data.data});
          return{
          isGenreCreationScreenOpen : false,
          Tags
          }
        })
      })
      .catch((err) => {
        console.log("Error is ", err);
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
      })
  }


  //TODO : Rename the below method correctly
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
    //TODO : Make this such that only after the user has written atleast something and paused then request goes back
    //TODO : Add functionality of igonre case for search text.
    if(value.length == 0){
      this.setState({
        suggestion : {
          //items : ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"],
          suggestionText: value,
          suggestions : []
        }
      })
    }
    else{
      // const regex = new RegExp(`^${value}`,"i")
      // let suggestions = this.state.suggestion.items.sort().filter(v => regex.test(v));
      axios.get(`/movies/search/${value}`)
        .then((r)=>{
          //TODO : Change server side logic to only recieve movie name and director name 
          //From Backend
          const resp = r.data.data;
          console.log("Response is",resp);
          const suggArr = resp.map((m)=>{
            //TODO : Check how to show in suggestion both name and dir name
            //TODO: Currently taking only name.
            return `${m.name}`;
            // return m;
          })
          this.setState({
            suggestion: {
              //items : ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"],
              suggestionText: value,
              suggestions: suggArr
            }
          }, () => {
            let suggestionArray = this.state.suggestion.suggestions;
            let suggestionObj = suggestionArray.map((e,idx) => {
              return {
                [e]: null
                // id : idx,
                // text : e
              }
            })
            console.log("suggestionObject is", suggestionObj)
            // var AutoInstanceObj = M.Autocomplete.getInstance(document.getElementById('autocomplete-input'));
            // console.log("Auto complete is", AutoInstanceObj);
            // var instances = M.Autocomplete.init(AutoInstanceObj, {
            //   minLength : 1
            // });
            // AutoInstanceObj.updateData(suggestionObj);
            // // console.log("Auto elems is", Autoelems);
            // // console.log("Auto instances is ", AutoInstances);
            // console.log("Available method is", M.Autocomplete);
            // console.log(AutoInstanceObj.isOpen)
            // console.log(AutoInstanceObj.open());
            // console.log(AutoInstanceObj.isOpen)
            // //Check what is getting wrong
            
          })
        })
        .catch((e)=>{
          //TODO : add to all these error alerts, a Toast message instead.
          M.toast({ html: `Error in fetching suggestions ${e.response.data.message}`, classes: "#ff1744 red accent-3" })
          //alert("Error in fetching suggestions",e);
        })
    }
    console.log(this.state);
  }

  onSearchSuggestionClicked = (value) => {
    console.log("clicked suggestion");
    this.setState((oldState)=>{
      return {
      suggestion : {
        //items : ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"],
        suggestionText: value,
        suggestions : []
      },
      searchCriteria : {
        ...oldState.searchCriteria,
        searchText : value
      }
    }})
  }

  //TODO : Sync the search Text with serach Text box in screen.

  onSearchBtnClicked = () =>{
    //TODO : Later refactor the load All api request in a method and call that
    //instead of writing it at a lot of places.
    //TODO : Make search Text and suggestionText sync now they are differnet
    let postObj = {
      ...this.state.searchCriteria,
      searchText : this.state.suggestion.suggestionText
      //TODO : Change the from here to 0 later since it is required 
      //because of not made then this will cause error.
      //TODO : Add JWT here also.
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
        //TODO : Add pagination later and only fetch some records at one go.
        this.setState({
          MovieList : r.data.data
        })
      })
      .catch((e)=>{
        //TODO : Display Toast for message

        //TODO : Also add text for 0 movies, 0 genres, No movie found in serach text block.
        console.log("error is",e);
        M.toast({ html: `Error in getting movie list after searching ${e.response.data.message}`, classes: "#ff1744 red accent-3" })
        //alert("Error in getting movie list after searching",e);
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
      //TODO : Check with only one value in array working of splice method.
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



    //TODO : trigger a search with new state.
  }

  onSortOptionClicked = (value)=>{
    //TODO : Check if the first i.e. "" is not the sort selected
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
      //TODO : Later add condition for disable and enable next and precious btn.
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
    //Else is previous
    else{
      //TODO : Later add condition for disable and enable next and precious btn.
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
        // alert('Login successful');
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
       // M.toast({html: `Error in login ${err}`, classes:"#ff1744 red accent-3"})
        //alert('Error in login ',err);
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
        M.toast({html: 'signup successful', classes:"#2e7d32 green darken-3"})
        // alert('signup successful');
        console.log('Response is',res);
        console.log(res.data.data.token);
        this.setState({
          isSignUpScreenOpen : false
        })
      })
      .catch((err)=>{
        M.toast({ html: `${err.response.data.message}`, classes: "#ff1744 red accent-3" })
        //M.toast({html: `Error in signup ${err}`, classes:"#ff1744 red accent-3"})
        //alert('Error in login ',err);
      })
  }

  //TODO : May change this to something else(very less chances) when react routing is added
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
    let options = {
      headers: {
        'Authorization':  jwt
      }
    }
    //TODO : Check on server side the person deleting is same as created the movie.
    axios.delete(`/movies/${movieID}`,options)
      .then((r)=>{
        console.log(r)
        //TODO : Later change this handling of movies to something else for now handling here itself
        this.setState((oldState) => {
          let idx;
          let MovieList = oldState.MovieList;
          MovieList.forEach((movie, movieIDx) => {
            if (movieID != movie._id) {
              idx = movieIDx;
            }
          });
          //TODO : Later look into it what is going wrong here and check if something 
          //can be done or is it ok.
          //When deleting we are removing the element from array but do we have to or should we directly 
          //call for a page refresh.
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
    //TODO : Replace all var to let
    //TODO : Make this a method and use here.
    console.log("Movie to be edited",movie);
    this.setState({
      MovieEditCreate : movie,
      isMovieCreationScreenOpen : true
    },()=>{
      var elems = document.querySelectorAll('select');
      var instances = M.FormSelect.init(elems);
      var multiSelect = document.getElementById("MultiSelectGenre");
      for (var i = 0; i < multiSelect.options.length; i++) {
        console.log("option is",(multiSelect.options[i].value));
        console.log("Movie Edit create",this.state.MovieEditCreate.genre)
        multiSelect.options[i].selected = this.state.MovieEditCreate.genre.indexOf(multiSelect.options[i].value) >= 0;
      }
      //multiSelect.value = this.state.MovieEditCreate.genre;
      M.updateTextFields();
    })
  }

  //TODO: Provide logout feature for Admin.

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
        //alert("Error in getting Tags",e);
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
        //TODO : Add pagination later and only fetch some records at one go.
        this.setState({
          MovieList : r.data.data
        })
      })
      .catch((e)=>{
        //TODO : Display Toast for message

        //TODO : Also add text for 0 movies, 0 genres, No movie found in serach text block.
        console.log("error is",e);
        M.toast({ html: `Error in getting movie list ${e.response.data.message}`, classes: "#ff1744 red accent-3" })
        // alert("Error in getting movie list",e);
      })

    //Checking if jwt token is there if yes then add Log out to admin

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
      var multiSelect = document.getElementById("MultiSelectGenre");
      if(multiSelect){
      for (var i = 0; i < multiSelect.options.length; i++) {
        console.log("option is",(multiSelect.options[i].value));
        console.log("Movie Edit create",this.state.MovieEditCreate.genre)
        multiSelect.options[i].selected = this.state.MovieEditCreate.genre.indexOf(multiSelect.options[i].value) >= 0;
      }
    }
      //multiSelect.value = this.state.MovieEditCreate.genre;
      M.updateTextFields();
  }


  //TODO : When ever we come from some other screen sort is not shown.



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
