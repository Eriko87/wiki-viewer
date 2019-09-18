import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class WikiApp extends React.Component{
        constructor(props) {
            super(props);
            this.state = {
                input: '',
                result: [],
                count: "",
                display: false
            };
            this.handleGetInput = this.handleGetInput.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
        }
    handleGetInput(event) {
            this.setState({
                input: event.target.value,
            });
    }
    
    handleSearch(event) {
            event.preventDefault();
            var query = this.state.input;
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + query;
            console.log(url)
            fetch(proxyurl + url)
                .then((resp)=> {
                        return resp.json()
                    }) // Convert data to json
                    .then((data)=> {
                        console.log(data)
                        var count = data.continue.gsroffset
                        console.log(count)
                        var results = []
                        var pages = data.query.pages
                        console.log(pages)
                        
                        Object.keys(pages).forEach(function (pageid) {
                            var title = pages[pageid].title;
                            var body = pages[pageid].extract;
                            var searchUrl = "https://en.wikipedia.org/wiki/" + title
                            results.push(<a key={pageid} href={searchUrl} target="_blank" rel="noopener noreferrer" ><div className="resultBox fade-in" ><h1>{title}</h1><p>{body}</p></div></a>)
                        });
                        console.log(results)

                        this.setState({
                            result: results,
                            count: count,
                            display: true
                        });    
                        console.log(this.state.result)
                });

        }
    

    render() {
        return (
            <div>
                <h1 id="title">Type Anything to Search</h1>
                <WikiSearch
                    search={this.handleSearch}
                    input={this.handleGetInput}
                    value={this.props.value}
                />
                <WikiList
                    result = {
                        this.state.result
                    }
                />
            </div>
        )
    }
}


class WikiSearch extends React.Component {
    render() {
        return (
            <div>
                
                <form  className="wrapper" onSubmit = {this.props.search} >
                    <input  className="searchBox" onChange={this.props.input} />
                    <button type = 'submit' ></button> 
                </form> 
            </div>
        );
    }
};
class WikiList extends React.Component {
    render() {
        return (<div>
            {this.props.result}
            </div>
        );
    }
}
                                        
ReactDOM.render(<WikiApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
