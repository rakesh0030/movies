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
    Links : ["Admin"],
    Tags : [],
    MovieList : [],
    searchCriteria : {
      sort : null,
      genres : [],
      searchText : "",
      //TODO : Currently not making next an previous disabled but will later do.
      size : 10,
      from : 0
    },
    //TODO : now adding blank in beginning just to make sure that none is chosen by default.
    //TODO: Later define a api for getting sortable fields.
    //TODO: Also add later label and other tags for select.
    sortableFields : ["", "name", "director", "99popularity"],
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
    //TODO : Might change later this so that we don't require below field but currently
    //using it to identify on which screen we are
    isLoginScreenOpen : false,
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

  setGenreName = (e)=>{
    this.setState({
      genreCreate : e
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
          imdb_score : e
        }
      }
    })
  }

  set99popularity = (e)=>{
    this.setState((oldState)=>{
      return {
        MovieEditCreate : {
          ...oldState.MovieEditCreate,
          "99popularity" : e
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
    return axios.post("/movies", requestObj, options)
      .then((r) => {
        M.toast({ html: `movie created successfully.`, classes: "#2e7d32 green darken-3" });
      })
      .catch((err) => {
        console.log("Error is ", err);
        M.toast({ html: `Error in creating movie ${err}`, classes: "#ff1744 red accent-3" })
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
    let requestObj = {genre : this.state.genreCreate}
    return axios.post("/genres", requestObj, options)
      .then((r) => {
        M.toast({ html: `Genre created successfully.`, classes: "#2e7d32 green darken-3" });
      })
      .catch((err) => {
        console.log("Error is ", err);
        M.toast({ html: `Error in creating Genre ${err}`, classes: "#ff1744 red accent-3" })
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
          const resp = r.data;
          console.log("Response is",resp);
          const suggArr = resp.map((m)=>{
            //TODO : Check how to show in suggestion both name and dir name
            //TODO: Currently taking only name.
            return `${m.name}`;
            // return `${m.name} dir : ${m.director}`;
          })
          this.setState({
            suggestion : {
              //items : ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"],
              suggestionText: value,
              suggestions : suggArr
            }
          })
        })
        .catch((e)=>{
          //TODO : add to all these error alerts, a Toast message instead.
          alert("Error in fetching suggestions",e);
        })
    }
    console.log(this.state);
  }

  onSearchSuggestionClicked = (value) => {
    console.log("clicked suggestion");
    this.setState({
      suggestion : {
        //items : ["Rakesh", "Ramesh", "Rajesh", "Deepak", "Find", "Fynd"],
        suggestionText: value,
        suggestions : []
      }
    })
  }

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
    axios.post('/movies/loadAll',postObj)
      .then((r)=>{
        //TODO : Add pagination later and only fetch some records at one go.
        this.setState({
          MovieList : r.data
        })
      })
      .catch((e)=>{
        //TODO : Display Toast for message

        //TODO : Also add text for 0 movies, 0 genres, No movie found in serach text block.
        console.log("error is",e);
        alert("Error in getting movie list after searching",e);
      })
  }

  onGenreClicked = (value) => {
    if (!this.state.searchCriteria.genres.includes(value)) {
      this.setState((oldState) => {
        let genres = [...oldState.searchCriteria.genres, value];
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            from : 0,
            genres
          }
        };
      },
      this.onSearchBtnClicked
      )
    }
    else{
      let idx = this.state.searchCriteria.genres.indexOf(value);
      //TODO : Check with only one value in array working of splice method.
      this.state.searchCriteria.genres.splice(idx,1);
      let genres = this.state.searchCriteria.genres;
      this.setState((oldState) => {
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            genres
          }
        };
      },
      this.onSearchBtnClicked)
    }



    //TODO : trigger a search with new state.
  }

  onSortOptionClicked = (value)=>{
    //TODO : Check if the first i.e. "" is not the sort selected
    if(value.length > 0){
      this.setState((oldState) => {
        return {
          searchCriteria: {
            ...oldState.searchCriteria,
            sort : value
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
        console.log(res.data.token);
        localStorage.setItem("jwt",res.data.token);
        localStorage.setItem("admin",JSON.stringify(res.data.adminDetails));
        
      })
      .catch((err)=>{
        M.toast({html: `Error in login ${err}`, classes:"#ff1744 red accent-3"})
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

  //TODO: Provide logout feature for Admin.

  componentDidMount(){
    axios.get('/genres')
      .then((r)=>{
        this.setState({
          Tags : r.data
        })
      })
      .catch((e)=>{
        console.log("error is",e);
        alert("Error in getting Tags",e);
      })
    const admin = JSON.parse(localStorage.getItem("admin"));
    const jwt = localStorage.getItem("jwt");
    console.log("admin is",admin);
    console.log("jwt is",jwt);
    let postObj = {...this.state.searchCriteria};
    let options = null;
    if(admin){
      options = {
        headers: {
          'Authorization':  jwt
        }
      }
    }
    axios.post('/movies/loadAll',postObj,options)
      .then((r)=>{
        //TODO : Add pagination later and only fetch some records at one go.
        this.setState({
          MovieList : r.data
        })
      })
      .catch((e)=>{
        //TODO : Display Toast for message

        //TODO : Also add text for 0 movies, 0 genres, No movie found in serach text block.
        console.log("error is",e);
        alert("Error in getting movie list",e);
      })

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('select');
      var instances = M.FormSelect.init(elems);
    });
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
        />
      </div>
    );
  }
}

export default Movies;
