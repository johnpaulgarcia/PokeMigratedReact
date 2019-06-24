import React, { Component } from 'react';
import bg from '../../assets/moving.gif';
import { getData } from '../../actions';
import { getRegions } from '../../api';
export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            regions: [],
            activeregion: '',
            activelocation: '',
            activearea: '',
            a1: false,
            a2: false,
            a3: false,
            found: []
        }
    }

    componentWillMount(){
        getData(getRegions)
        .then(data=>{
            let results = data.data.results;
            this.setState({data: results,regions: results});
        })
    }

    back = () => {
        let { a1,a2,a3,activelocation,activearea,activeregion } = this.state;

        if(a2){

            // console.log("ENTERED A2",activeregion);
            getData(getRegions)
            .then(data=>{
                let results = data.data.locations || data.data.areas || data.data.results || [];
                this.setState({data: results,regions: results});
            });
            this.setState({
                a1: true,
                a2: false,
                a3: false
            })
           
        }

        if(a3){

            getData(activelocation)
            .then(data=>{
                let results = data.data.locations || data.data.areas || [];
                this.setState({data: results,regions: results});
            });
            this.setState({
                a1: false,
                a2: true,
                a3: false
            })
        }
    }

    findingNemo = (val) => {
        getData(val)
            .then(data=>{
                let data1 = data.data.pokemon_encounters;
                let data_length = data1.length;
                let num = Math.floor(Math.random()*data_length);
                let found = data1[num].pokemon.url;
                let name = data1[num].pokemon.name;
                
                  getData(found)
                  .then(response=>{
                      let data = response.data;
                      
                      let {species: {name},sprites: {front_default}} = data;
                      
                      let status = [];
                      data.stats.map(key=>{
                          let obj2 = Object.create({
                              name: key.stat.name,
                              stat: key.base_stat
                          });

                          status.push(obj2);
                      })

                      let obj = Object.create({
                        name,
                        avatar: front_default,
                        status: status
                    });

                      this.setState({
                          found: obj
                      })
                      console.log(obj.status[0].stat);
            
                  })

            })
    }

    clicked = (val) => {
        // this.setState({
        //     activeregion: val.name
        // })

      val = val.target.value;
      
      if(val.match(/area/,'gi')){
        this.setState({activearea: val})

            // run algorithm
            this.findingNemo(val);

      }
      else{
       if(val.match(/location/,'gi')){
           this.setState({
               activearea: val
           })
       }

       if(val.match(/region/,'gi')){
           this.setState({
               activelocation: val
           })
       }
       getData(val)
        .then(data=>{
            let results = data.data.locations || data.data.areas || [];
            if(data.data.locations){
                this.setState({a1: false,a2: true})
            }
            if(data.data.areas){
                this.setState({
                    a1: false,
                    a2: false,
                    a3: true
                })
            }
            this.setState({data: results,regions: results});
        })
    }
    }

    render(){
        let { data,a1,a2,a3,activeregion,activelocation,activearea,found } = this.state;
        return(
            <div  style={{backgroundImage: `url(${bg})`,backgroundSize: 'cover'}} class="hometown">
                <div class="left">
                   {!a1 && (a2 || a3) &&  <button onClick={()=>this.back()} class="back">
                        Back
                    </button>}
                    <select class="option" onClick={(e)=>this.clicked(e)}>
                        {
                            data.map(data=>{
                                let url = data.url;
                                return(
                                    
                                    <option  value={`${data.url}`} class="option-actual">{data.name.toUpperCase()}</option>

                                );
                            })
                        }
                    </select>

                   
                </div>

                <div class="content">
                    <h1 class="place">
                       Welcome.
                    </h1>

                    <div class="content-2">
                        <div class="logo-a">
                            <div class="pokemon">
                                <img class="avatar" src={`${found.avatar}`} />
                            </div>
                            <h3 class="pkk-tag">You found {found.name}</h3>
                        </div>

                        <div class="attributes">
                            <div class="props">
                              <fieldset>
                                <legend class="legend">
                                    Pokemon Attributes
                                </legend>

                                {
                                    found.status ? found.status.map(key=>{
                                        return(
                                            <p class="tags-x">{key.name} : {key.stat}</p>
                                        )
                                    }): 'No data'
                                }
                              </fieldset>
                            </div>
                        </div>
                    </div>

                    <div class="bag">
                     <p class="pk-tag">Your Poke Bag</p>
                    </div>
                </div>
            </div>
        );
    }
}