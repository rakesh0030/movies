import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import './Movies.module.css';
import Tags from '../../components/SideBar/Tags/Tags';

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
      searchText : ""
    },
    //TODO : now adding blank in beginning just to make sure that none is chosen by default.
    //TODO: Later define a api for getting sortable fields.
    //TODO: Also add later label and other tags for select.
    sortableFields : ["", "name", "director", "99popularity"]
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

    axios.post('/movies/loadAll')
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
        />
      </div>
    );
  }
}

export default Movies;
