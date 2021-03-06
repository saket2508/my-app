import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SearchBar from './searchBar';
import PieChart from './pieChart';
import LinePlot from './linePlot';
import BarPlot from './barPlot';
import CardLoading from './cardLoading';
import Legend from './legend';
import TabsMenu from './tabsMenu';
import './chart.css';
import { CardHeader } from '@material-ui/core';

const dates_chart=[]

const useStyles = makeStyles((theme) => ({
    root:{
        marginTop:40,
        marginBottom:40,
    },
    heading:{
        marginBottom:1,
        flex:1,
        flexDirection:"row"
    },
    title:{
        fontSize: 14,
    },
    card:{
        display: 'block',
        width: '100%',
        transitionDuration: '0.3s',
        height: '100%'
    },
    cardTitle:{
        marginBottom:0,
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center',
    },
    avatar:{
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
        marginLeft: theme.spacing(0.65),
    },
  }));

function format(item){
    return new Intl.NumberFormat('en-US').format(item)
}

const TodayCases = ({data}) => {
    if(data===0){
        return<div></div>
    }
    else{
        return(
            <div style={{display:'flex', flexWrap:'wrap', flexDirection:'row', paddingLeft:2, marginTop:2,alignItems:'center'}}>
                <div style={{color:'#9e9e9e', fontWeight:'600', fontSize:'10'}}>+{format(data)}</div>
            </div>
        )
    }
}

const ChartTitle = ({selectedCountry, selectedItem}) =>{
    const classes= useStyles()
    return(
        <div>
            <div className={classes.cardTitle}>
                {/* <Typography variant="h6" style={{fontWeight:'400'}}>COVID-19: {selectedCountry} Stats</Typography> */}
                <div style={{fontWeight:'400', fontSize:'19px'}}>COVID-19: {selectedCountry} Stats</div>
                <Avatar src={selectedItem.flag} className={classes.avatar} alt="flag-icon"/>
                {/* <img src={selectedItem.flag} style={{height:24, width:32}}/> */}
                {/* <img className='ml-1' src={`https://www.countryflags.io/${selectedItem.code}/flat/32.png`}></img> */}
            </div>
           
        </div>
    )
 }

export default function Chart(){
    
    //const dates=[]
    const [ error, setError ]= useState(false)
    const [ loading, setLoading ]= useState(true)

    //general info of every country(cases, deaths, etc)
    const [ dataCountries, setDataCountries ]= useState({})
    const [ list, setList ]= useState([])

    const [ dates, setDates ]= useState([])

    //time-series data for every country
    const [ timeSeriesData, setTimeSeriesData ] = useState({})

    //self-explanatory
    const [ selectedCountry, setSelectedCountry ]= useState("USA")
    const [ selectedItem, setSelectedItem ]= useState({})
    const [ worldData, setWorldData ]= useState({})

    const [ pieChartOne, setPieChartOne ]= useState({})
    const [ pieChartTwo, setPieChartTwo ]= useState({})
    const [ chartOne, setChartOne ]= useState({})
    const [ chartTwo, setChartTwo ]= useState({})

    const [ variableOne, setVariableOne ]= useState("Cases")
    const [ variableTwo, setVariableTwo ]= useState("New Cases")

    const options= [
        {
            id:1,
            name:'Cases',
        },
        {
            id:2,
            name:'Deaths',
        },
        {
            id:3,
            name:'Active',
        },
    ]

    useEffect(() => {
        getData()
    },[])

    const changeValue = async(value) => {
        let key= ""
        if(value!==""){
            key = value
        }
        if(key===""){
            //console.log('empty input')
        }
        else if(key==="USA"){
            setSelectedCountry(key)
            setSelectedItem(dataCountries[key])

            setPieChartTwo({
                datasets: [{
                    data: [dataCountries["USA"].Active,
                    dataCountries["USA"].Recovered,
                    dataCountries["USA"].Deaths],
                    backgroundColor:['#42a5f5','#9ccc65','#ff7043']
                }],
                labels: ['Active','Recovered','Deaths']
            })

            let res= await fetch("https://pomber.github.io/covid19/timeseries.json")
            let response= await res.json()
            let usa_cases_ts=[] 
            let usa_newcases_ts=[] 
            let usa_active_ts= []
            let usa_deaths_ts=[] 
            let usa_newdeaths_ts=[] 

            response['US'].map((item) => {
                let usa_cases=item['confirmed']
                let deaths_usa= item['deaths']
                let recovered_usa= item['recovered']
                let active_ca= usa_cases-recovered_usa-deaths_usa
                usa_cases_ts.push(usa_cases) 
                usa_deaths_ts.push(deaths_usa) 
                usa_active_ts.push(active_ca) 
            })

            for(let i=0;i<usa_cases_ts.length-1;i++){
                let newcases_usa= usa_cases_ts[i+1]-usa_cases_ts[i]
                let newdeaths_usa= usa_deaths_ts[i+1]-usa_deaths_ts[i]
                usa_newcases_ts.push(newcases_usa)
                usa_newdeaths_ts.push(newdeaths_usa)
            }

            // const canada_ts= {
            //     cases: usa_cases_ts,
            //     deaths: usa_deaths_ts,
            //     active: usa_active_ts,
            //     newcases: usa_newcases_ts,
            //     newdeaths: usa_newdeaths_ts,
            // }

            if(variableOne==="Cases"){
                setChartOne({
                    labels: dates,
                        datasets:[
                          {
                                fill:true,
                                pointRadius:0,
                                borderColor:'#424242',
                                label:'Total Cases',
                                data:  usa_cases_ts,
                                backgroundColor:'#f5f5f5'
                          }
                        ]
                })
            }
            else if(variableOne==="Deaths"){
                setChartOne({
                    labels: dates,
                        datasets:[
                          {
                            fill:true,
                            pointRadius:0,
                            borderColor:'#ff7043',
                            label:'Total Deaths',
                            data: usa_deaths_ts,
                            backgroundColor:'#fbe9e7'
                          }
                        ]
                })
            }
            else{
                setChartOne({
                    labels: dates,
                        datasets:[
                          {
                            fill:true,
                            pointRadius:0,
                            borderColor:'#1e88e5',
                            label:'Active Infections',
                            data: usa_active_ts,
                            backgroundColor:'#e3f2fd'
                          }
                        ]
                })
            }

            if(variableTwo==="New Cases"){
                setChartTwo({
                    labels: dates.slice(1,dates.length),
                        datasets:[
                          {
                            fill:false,
                            borderColor:'#757575',//gray border
                            label:'New Infections',
                            data: (usa_newcases_ts),
                            backgroundColor:'#757575'//gray bg
                          }
                        ]
                })
            }
            else{
                setChartTwo({
                    labels: dates.slice(1,dates.length),
                        datasets:[
                          {
                            fill:false,
                            borderColor:'#ff7043',
                            label:'New Fatalities',
                            data: (usa_newdeaths_ts),
                            backgroundColor:'#ff5722'
                          }
                        ]
                })
            }

        }
        else{
            setSelectedCountry(key)
            setSelectedItem(dataCountries[key])

            setPieChartTwo({
                datasets: [{
                    data: [dataCountries[key].Active,
                    dataCountries[key].Recovered,
                    dataCountries[key].Deaths],
                    backgroundColor:['#42a5f5','#9ccc65','#ff7043']
                }],
                labels: ['Active','Recovered','Deaths']
            })

        if(variableOne==="Cases"){
            setChartOne({
                labels: dates,
                    datasets:[
                      {
                            fill:true,
                            pointRadius:0,
                            borderColor:'#424242',
                            label:'Total Cases',
                            data:  timeSeriesData[key].casesData,
                            backgroundColor:'#f5f5f5'
                      }
                    ]
            })
        }
        else if(variableOne==="Deaths"){
            setChartOne({
                labels: dates,
                    datasets:[
                      {
                        fill:true,
                        pointRadius:0,
                        borderColor:'#ff7043',
                        label:'Total Deaths',
                        data: timeSeriesData[key].deathsData,
                        backgroundColor:'#fbe9e7'
                      }
                    ]
            })
        }
        else{
            setChartOne({
                labels: dates,
                    datasets:[
                      {
                        fill:true,
                        pointRadius:0,
                        borderColor:'#1e88e5',
                        label:'Active Infections',
                        data: timeSeriesData[key].activeData,
                        backgroundColor:'#e3f2fd'
                      }
                    ]
            })
        }

        if(variableTwo==="New Cases"){
            setChartTwo({
                labels: dates.slice(1,dates.length),
                    datasets:[
                      {
                        fill:false,
                        borderColor:'#757575',//gray border
                        label:'New Infections',
                        data: (timeSeriesData[key].newCasesData),
                        backgroundColor:'#757575'//gray bg
                      }
                    ]
            })
        }
        else{
            setChartTwo({
                labels: dates.slice(1,dates.length),
                    datasets:[
                      {
                        fill:false,
                        borderColor:'#ff7043',
                        label:'New Fatalities',
                        data: (timeSeriesData[key].newDeathsData),
                        backgroundColor:'#ff5722'
                      }
                    ]
            })
        }
        }
    }

    const changeCumulativeVariable = (item) => {
        if(item.id===1){
            setVariableOne("Cases")
            setChartOne({
                labels: dates,
                    datasets:[
                      {
                            fill:true,
                            pointRadius:0,
                            borderColor:'#424242',
                            label:'Total Cases',
                            data:  timeSeriesData[selectedCountry].casesData,
                            backgroundColor:'#f5f5f5'
                      }
                    ]
            })
        }
        if(item.id===2){
            setVariableOne("Deaths")
            setChartOne({
                labels: dates,
                    datasets:[
                      {
                        fill:true,
                        pointRadius:0,
                        borderColor:'#ff7043',
                        label:'Total Deaths',
                        data: timeSeriesData[selectedCountry].deathsData,
                        backgroundColor:'#fbe9e7'
                      }
                    ]
            })
        }
        if(item.id===3){
            setVariableOne("Active Cases")
            setChartOne({
                labels: dates,
                    datasets:[
                      {
                        fill:true,
                        pointRadius:0,
                        borderColor:'#1e88e5',
                        label:'Active Infections',
                        data: timeSeriesData[selectedCountry].activeData,
                        backgroundColor:'#e3f2fd'
                      }
                    ]
            })
        }
    }

    const changeDailyVariable = (item) => {
        if(item.id===1){
            setVariableTwo("New Cases")
            setChartTwo({
                labels: dates.slice(1,dates.length),
                    datasets:[
                      {
                        fill:false,
                        borderColor:'#757575',//gray border
                        label:'New Infections',
                        data: (timeSeriesData[selectedCountry].newCasesData),
                        backgroundColor:'#757575'//gray bg
                      }
                    ]
            })
        }
        else{
            setVariableTwo("New Deaths")
            setChartTwo({
                labels: dates.slice(1,dates.length),
                    datasets:[
                      {
                        fill:false,
                        borderColor:'#ff7043',
                        label:'New Fatalities',
                        data: (timeSeriesData[selectedCountry].newDeathsData),
                        backgroundColor:'#ff5722'
                      }
                    ]
            })
        }
    }


    const getData= async() => {
        //list to store names of countries
        // setLoading(true)

        const countries=[]
        const monthsDict= {'1':'Jan','2':'Feb','3':'Mar','4':'Apr','5':'May','6':'Jun','7':'Jul','8':'Aug','9':'Sep','10':'Oct','11':'Nov','12':'Dec'}

        let countriesInfo={}
        const timeSeriesInfo={}

        try{
            const [ response1, response2 ]= await Promise.all([
                fetch('https://corona.lmao.ninja/v2/countries?sort=cases'),
                fetch('https://pomber.github.io/covid19/timeseries.json')
            ])
    
            const rawdata1= await response1.json()
    
            let world_cases=0
            let world_newCases=0
            let world_deaths=0
            let world_recovered=0
            let world_active=0
    
            rawdata1.map((element) => {
                let name= element.country
    
                if(name=== "S. Korea"){
                    name= "South Korea"
                }

                if(name==="Syrian Arab Republic"){
                    name="Syria"
                }

                if(name==="Lao People's Democratic Republic"){
                    name="Laos"
                }
                
                countries.push(name)
                let cases= element.cases
                let newCases = element.todayCases
                let deaths= element.deaths
                let active= element.active
                let recovered= element.recovered
    
                world_cases+= cases
                world_newCases+= newCases
                world_deaths+= deaths
                world_recovered+= recovered
                world_active+= active
    
                let obj={
                    Cases:cases,
                    NewCases:newCases,
                    Deaths:deaths,
                    Recovered:recovered,
                    Active:active,
                    code: element.countryInfo.iso2,
                    flag: element.countryInfo.flag,
                    cfr: ((deaths/cases)*100).toFixed(1),
                    rr: ((recovered/cases)*100).toFixed(1),
                    ar: ((active/cases)*100).toFixed(1),
                }
    
                countriesInfo[name]= obj
            })
    
            const world_data={
                Cases: world_cases,
                NewCases: world_newCases,
                Deaths: world_deaths,
                Recovered: world_recovered,
                Active: world_active,
                cfr: ((world_deaths/world_cases)*100).toFixed(1),
                rr: ((world_recovered/world_cases)*100).toFixed(1),
                ar: ((world_active/world_cases)*100).toFixed(1),
            }
    
            countries.sort()
            setList(countries)
    
            const rawData2 = await response2.json()
            
            rawData2["Afghanistan"].map((item) => {
                let m= ""
                let d= item.date.slice(item.date.indexOf('-', 5)+1,item.date.length)
                // let month= item.date.slice(5,6)
                let month = item.date.slice(5, item.date.indexOf('-', 5))
                m = monthsDict[month]
                let date =m+ ' '+d
                dates_chart.push(date)
               //console.log(date)
            })
    
            setDates(dates_chart.slice(dates_chart.length/2))
    
            for(let key in rawData2){
    
                let country_name= key
                if(country_name==="US"){
                    country_name= "USA"
                }
                if(country_name==="United Kingdom"){
                    country_name="UK"
                }

                if(country_name==="Korea, South"){
                    country_name="South Korea"
                }
                if(country_name==="Taiwan*"){
                    country_name="Taiwan"
                }
                if(country_name==="United Arab Emirates"){
                    country_name="UAE"
                }

                if(country_name==="West Bank and Gaza"){
                    country_name="Palestine"
                }
                if(country_name==="Syrian Arab Republic"){
                    country_name="Syria"
                }
    
                let country_cases=[]
                let country_newCases=[]
                let country_deaths=[]
                let country_newDeaths=[]
                let country_active=[]
                rawData2[key].map((item) => {
                    country_cases.push(item.confirmed)
                    country_deaths.push(item.deaths)
                    country_active.push(item.confirmed-item.deaths-item.recovered)
                })
    
                for(let i=1;i<=country_cases.length-1;i++){
                    let newInfections= country_cases[i]-country_cases[i-1]
                    let newFatalities= country_deaths[i]-country_deaths[i-1]
                    country_newCases.push(newInfections)
                    country_newDeaths.push(newFatalities)
                }
    
                let info={
                    casesData: country_cases,
                    deathsData: country_deaths,
                    activeData: country_active,
                    newCasesData: country_newCases,
                    newDeathsData: country_newDeaths
                }
    
                timeSeriesInfo[country_name]= info
            }
            //console.log(countriesInfo)
            setDataCountries(countriesInfo)
            setTimeSeriesData(timeSeriesInfo)
            setSelectedItem(countriesInfo["USA"])
            setWorldData(world_data)
            //console.log(timeSeriesInfo)
            setPieChartOne({
                datasets: [{
                    data: [world_data.Active,
                        world_data.Recovered,
                        world_data.Deaths],
                        backgroundColor:['#42a5f5','#9ccc65','#ff7043']
                }],
                labels: ['Active','Recovered','Deaths']
            })
    
            setPieChartTwo({
                datasets: [{
                    data: [countriesInfo["USA"].Active,
                    countriesInfo["USA"].Recovered,
                    countriesInfo["USA"].Deaths],
                    backgroundColor:['#42a5f5','#9ccc65','#ff7043']
                }],
                labels: ['Active','Recovered','Deaths']
            })
    
    
            setChartTwo({
                    labels: dates_chart.slice(1,dates_chart.length/2),
                        datasets:[
                          {
                            fill:false,
                            //borderColor:'#9e9e9e',//gray border
                            label:'New Infections',
                            data: (timeSeriesInfo["USA"].newCasesData),
                            backgroundColor:'#757575'//gray bg
                          }
                        ]
            })
    
            setChartOne({
                labels: dates_chart.slice(dates_chart.length/2),
                    datasets:[
                      {
                            fill:true,
                            pointRadius:0,
                            borderColor:'#424242',
                            label:'Total Cases',
                            data:  timeSeriesInfo["USA"].casesData,
                            backgroundColor:'#f5f5f5'
                      }
                    ]
            })

            setLoading(false)
        }
        catch(error){
            setLoading(false)
            setError(true)
            console.log(error)
        }

    }

    const classes= useStyles()

    if(error){
        return(
        <div style={{flex:1,justifyContent:'center',marginTop:50}}>
            <strong>Unable to get plot data. There appears to be a problem with the server :(</strong>
        </div>
        )
    }
    if(loading){
        return(
            <CardLoading/>
        )
    }
    else{
        return(
            <div style={{marginTop: 30, marginBottom: 60}} className="container-lg">
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                    <Card variant="outlined" className={classes.card}>
                        <CardHeader
                            title={
                               <div>
                                    <div className={classes.cardTitle}>
                                    {/* <Typography variant="h6" style={{fontWeight:'400'}}>COVID-19: World Figures</Typography>   */}
                                    <div style={{fontWeight:'400', fontSize:'19px'}}>COVID-19: World Figures</div>
                                </div>
                               </div>
                                
                            }    
                        />
                        <CardContent>
                            <div className='row mb-3'>
                                <div className='col-lg-6 col-md-12 mb-2'>
                                    <small className='text-secondary mb-2' style={{fontWeight:'600', letterSpacing: 1.0}}>Total Coronavirus Cases</small>
                                    <h4 style={{fontWeight:'600'}}>{format(worldData.Cases)}</h4>
                                    <TodayCases data={worldData.NewCases}/>
                                </div>
                                <PieChart {...pieChartOne}/>
                            </div>
                            <Legend {...worldData}/>
                        </CardContent>
                    </Card>
                    </Grid>
    
                    <Grid item xs={12} sm={6}>
                    <Card variant="outlined" className={classes.card}>
                        <CardHeader
                            title={
                                <ChartTitle selectedCountry={selectedCountry} selectedItem={selectedItem}/>
                            }
                        />
                        <CardContent>
                            <div className='row mb-3'>
                                <div className='col-lg-6 col-md-12 mb-2'>
                                    <small className='text-secondary mb-2' style={{fontWeight:'600', letterSpacing: 1.0}}>Total Coronavirus Cases</small>
                                    <h4 style={{fontWeight:'600'}}>{format(selectedItem.Cases)}</h4>
                                    <TodayCases data={selectedItem.NewCases}/>
                                </div>
                                <PieChart {...pieChartTwo}/>
                            </div>
                            <Legend {...selectedItem}/>

                            <SearchBar selectedCountry = {selectedCountry} changeValue = {changeValue} list={list}/>
                        </CardContent>
                    </Card>
                    </Grid>
                  <Grid item xs={12} sm={6}>
                      <Card variant="outlined" className= {classes.card}>
                          <CardHeader
                                title={
                                // <Typography variant="h6" style={{fontWeight:'400'}}>{selectedCountry}: {variableOne} Over Time</Typography>
                                <div style={{fontWeight:'400', fontSize:'19px'}}>{selectedCountry}: {variableOne} Over Time</div>
                                }
                            />
                          <CardContent>
                                <div className="row">
                                    <TabsMenu data= {options} handleChange= {changeCumulativeVariable}/>
                                    <LinePlot {...chartOne}/>
                                </div>
                          </CardContent>
                      </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                      <Card variant="outlined" className= {classes.card}>
                          <CardHeader
                                title={
                                    // <Typography variant="h6" style={{fontWeight:'400'}}>{selectedCountry}: {variableTwo} Over Time</Typography>
                                    <div style={{fontWeight:'400', fontSize:'19px'}}>{selectedCountry}: {variableTwo} Over Time</div>
                                }
                            />
                          <CardContent>
                                <div className="row">
                                    <TabsMenu data= {options.slice(0,-1)} handleChange= {changeDailyVariable}/>
                                    <BarPlot {...chartTwo}/>
                                </div>
                          </CardContent>
                      </Card>
                  </Grid>
                </Grid>
            </div>
        )
    }
}