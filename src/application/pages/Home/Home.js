import React, { Component,Fragment } from 'react';
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
            found: [],
            activeFind: '',
            visible: false,
            bag: [],
            recapture: true,
            notify: false,
            message: ''
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
                a3: false,
               
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
                a3: false,
                visible: false
            })
        }
    }

    findingNemo = (val) => {
       if(this.state.bag.length <= 7){
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
                          found: obj,
                          visible: true,
                          recapture: true
                      })
                      
            
                  })

            });
        }
        else {
            this.setState({

                notify: true,
                message: "Your bag is full."
            });

            setTimeout(()=>{
                this.setState({
                    notify: false,
                    message: ''
                })
            },1000)
        }
    }


    capture = () => {
        let rand = (Math.random() * 100)+Math.random()*20;
        console.log(this.state.found);
        let id = this.state.bag.length + 1;
        let name = this.state.found.name;
        let avatar = this.state.found.avatar;
        let obj = {
            id,
            name,
            avatar
        }

       
        if(rand>40){
            this.setState({bag: [...this.state.bag,obj]});
        }
        else {
            this.setState({

                notify: true,
                message: `${name.toUpperCase()} has escaped. Such talent.`
            });

            setTimeout(()=>{
                this.setState({
                    notify: false,
                    message: ''
                })
            },3000)
        }

        this.setState({
            found: [],
            recapture: false
            
        })
    }

    del = (id) => {
        if(window.confirm("Are you sure to remove this from pokemon your bag?")){
            this.setState({
                bag: this.state.bag.filter(key=>key.id !== id)
            })
        }
    }

    clicked = (val) => {
       
        this.setState({
           notify: false,
           message: ''
        })

      val = val.target.value;
      
      if(val.match(/area/,'gi')){
        this.setState({activearea: val,activeFind: val})

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
        let { 
            data,
            a1,
            a2,
            a3,
            found,
            visible,
            bag,
            recapture,
            notify,
            message
         } = this.state;
        console.log(bag);
        return(
            <div  style={{backgroundImage: `url(${bg})`,backgroundSize: 'cover'}} class="hometown">
                {notify &&
                    <div class="notify">
                        {message}
                    </div>

                }
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

                   {visible && <div class="content-2">
                        {recapture && <div class="logo-a">
                            <div class="pokemon">
                                <img class="avatar" src={`${found.avatar}`} />
                            </div>
                            <h3 class="pkk-tag">You found {found.name}</h3>
                        </div>}

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
                                    }): 'No Pokemon to scan'
                                }
                              </fieldset>
                            </div>

                            <div class="btns">
                              {recapture &&  <button onClick={()=>this.capture()} class="btn-capture">
                                    Capture
                                </button>}

                                <button onClick={()=>this.findingNemo(this.state.activeFind)} class="btn-capture explore">
                                Explore
                            </button>
                            </div>
                        </div>
                    </div>

                   
                
                }

                    <div class="bag">
                     <p class="pk-tag">Your Poke Bag</p>
                     <div class="bag-actual">
                        {bag ? bag.map(key=>{
                           
                            return(
                                <div onClick={()=>this.del(key.id)}>
                                <img class="bag-item" src={`${key.avatar}`} />
                                <p class="name-x">{key.name}</p>
                                </div>
                            );
                        }):'No data'}
                     </div>
                    </div>
                </div>
            </div>
        );
    }
}