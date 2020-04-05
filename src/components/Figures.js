import React, { Component} from "react"
class Figures extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
        <div id='c2' class='container mb-4'>
            <div class="card-group">
            <div class="card">
                <div class="card-body">
                    <p class="h3 card-title text-center font-weight-light">CONFIRMED</p>         
                    <p className='h3 text-secondary text-center'>{this.props.data.Cases}</p>
                    <h5 className='text-center'><span class="badge badge-pill badge-secondary">+{this.props.data.TodayCases}</span></h5>     
                </div>
            </div>
            <div class="card">
                <div class="card-body"> 
                <p class=" h3 card-title text-center font-weight-light">DEATHS</p>  
                    <p className='h3 text-danger text-center'>{this.props.data.Deaths}</p>
                    <h5 className='text-center'><span class="badge badge-pill badge-danger">+{this.props.data.TodayDeaths}</span></h5>   
                </div>
            </div>
            <div class="card">               
                <div class="card-body">
                <p class="h3 card-title text-center font-weight-light">RECOVERED</p>
                    <p className='h3 text-success text-center'>{this.props.data.Recovered}</p> 
                </div>
            </div>
            <div class="card">               
                <div class="card-body">
                <p class="h3 card-title text-center font-weight-light">ACTIVE</p>
                    <p className='h3 text-primary text-center'>{this.props.data.Active}</p>               
                </div>
            </div>
        </div>
        </div>

        )
    }

}

export default Figures