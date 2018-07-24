import React, { Component } from 'react';
import './App.css';
// import Results from './Results.js';


class App extends Component {

  state = {
    searchTerm: '',
    searchResult: null,
    nextPage: null,
    prevPage: null
  };


  searchNasa = async searchTerm => {
    try 
    {
      const response = await fetch (`https://images-api.nasa.gov/search?&q=${searchTerm}`);
      const data = await response.json();

      console.log(data);

      data.collection.links === undefined ?
        this.setState((prevState, props) => ({
          ...prevState,
          searchResult: data.collection.items,
          prevPage: null

         }))
        :
        this.setState((prevState, props) => ({
          ...prevState,
          searchResult: data.collection.items,
          nextPage: data.collection.links[0].href,
          prevPage: null

         }));
        
    }
    catch (error)
    {
      console.log('fetch failed');
    }
  };

  
  loadNextPage = async nextPage => {
    try 
    {
      const response = await fetch (`${nextPage}`);
      const data = await response.json();

      console.log(data);

      data.collection.links.length > 1 ?
        this.setState((prevState, props) => ({
          ...prevState,
          searchResult: data.collection.items,
          prevPage: data.collection.links[0].href,
          nextPage: data.collection.links[1].href
         }))
        :
        this.setState((prevState, props) => ({
          ...prevState,
          searchResult: data.collection.items,
          nextPage: data.collection.links[0].href
         }));

      
        
    }
    catch (error)
    {
      console.log('fetch failed');
    }
  };

  loadPrevPage = async prevPage => {
    try 
    {
      const response = await fetch (`${prevPage}`);
      const data = await response.json();

      // console.log(data);

      data.collection.links.length > 1 ?
        this.setState((prevState, props) => ({
          ...prevState,
          searchResult: data.collection.items,
          prevPage: data.collection.links[0].href,
          nextPage: data.collection.links[1].href
         }))
        :
        this.setState((prevState, props) => ({
          ...prevState,
          searchResult: data.collection.items,
          nextPage: data.collection.links[0].href
         }));
        
    }
    catch (error)
    {
      console.log('fetch failed');
    }
  };

  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value
    }));
    console.log(value);
  
  };

  handleKeyPress = event => {
    const {value} = event.target;
    if(value.length > 2 && event.key === 'Enter') {
      this.searchNasa(value);
      }
    };

  movePageNext = event => {
    this.loadNextPage(this.state.nextPage);
 
  }

  movePagePrev = event => {
    this.loadPrevPage(this.state.prevPage);
  }

  render() {
    const { searchTerm, searchResult } = this.state;

    if (!this.state.searchResult) {
      return (
        <div className="App">
          <div className='searchField'>
            <input onChange='search' placeholder='enter your search term here...' onChange={this.handleChange} onKeyPress={this.handleKeyPress} value={searchTerm} />
          </div>
        </div>
        );
    }
    else {
      return (
        <div className="App">
          <div className='searchField'>
              <input onChange='search' placeholder='enter your search term here...' onChange={this.handleChange} onKeyPress={this.handleKeyPress} value={searchTerm} />
          
         
            {this.state.prevPage === null ? 
            <div id='controls'>
                <button className='pagingButtons' onClick={this.movePageNext}>Next</button>
            </div>
              :
              <div id='controls'>
                <button className='pagingButtons' onClick={this.movePagePrev}>Previous</button>
                <button className='pagingButtons' onClick={this.movePageNext}>Next</button>
              </div>
            }
          </div>
          <div className='results'>
          
          {this.state.searchResult.map((a) => (
              a.links === undefined || JSON.stringify(a.links).indexOf('.srt') > -1 || JSON.stringify(a.links).indexOf('.vtt') > -1  ?
                <div className='return'>
                  <div className='infopanel'>
                    <div className='title'>
                      <h2>{a.data[0].title}</h2>
                      <hr />
                      <div className='smalldetail'>
                        <h4>Created: {a.data[0].date_created}</h4>
                        <h4>Center: {a.data[0].center}</h4>
                        <p className='typetag'>Media Type : {a.data[0].media_type}</p>
                      </div>
                    </div>
                    <div className='desc'>
                    <h4>Description</h4>
                      <p className='desc_text' dangerouslySetInnerHTML={ {__html: a.data[0].description} } />
                    </div>
                  </div>
                </div>
              :
                <div className='return'>
                  <div className='thumbnail'>
                    <img alt='' src={a.links[0].href}/>
                  </div>
                  <div className='infopanel'>
                    <div className='title'>
                      <h2>{a.data[0].title}</h2>
                      <hr />
                      <div className='smalldetail'>
                        <h4>Created: {a.data[0].date_created}</h4>
                        <h4>Center: {a.data[0].center}</h4>
                        <p className='typetag'>Media Type : {a.data[0].media_type}</p>
                      </div>
                    </div>
                    <div className='desc'>
                    <h4>Description</h4>
                      <p className='desc_text' dangerouslySetInnerHTML={ {__html: a.data[0].description} } />
                    </div>
                  </div>
                </div>
              ))}
          </div>
  
        </div>
      );
    }
  }
}

export default App;
