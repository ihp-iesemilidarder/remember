new WOW().init(); //initialize animations Wow's library

// This class is responsible of add, remove, show variables in localStorage/sessionStorage, or, also add new property in a variable' object specified
export class DB{
    constructor(variable=String,storageType=String){
        // variable localStorage/sessionStorage for work
        this.var = variable;
        this.storage = storageType;
        // storage the localStorage/sessionStorage's value or storage a empty list
        this.list = JSON.parse(window[this.storage].getItem(this.var))||[];

    }

    // check if in the variable 'users', exist the user specified
    existUser(user){
        let result = this.list.find(el=>el.nick==user);
        if(result == undefined){
            return false;
        }else{
            return true;
        }
    }

    //show the variable specified
    show(exitBool=false){
        if(exitBool==false){
            return this.list;
        }else{
            if(this.list.length>0){
                return true;
            }else{
                return false;
            }
        }
        
    }

    // add new property, when the condition is true, in the variable specified
    addProperty(condition,key,value){
        let list = this.list.map(el=>{
            if(el.nick == condition){
                el[key]=value;
                return this.list;
            }
        });
        let list2 = [];
        for(let el of list){
            if(el != undefined){
                for(let ob of el){
                    list2.push(ob);
                }                
            }
        }
        this.add(list2,true,false)
    }

    //add new data in the sessionStorage/localStorage's array specified
    add(data=String,onlyOneData=false,dataList=true){
        if (onlyOneData == true) this.list = [];
        (dataList==false)?this.list=data:this.list.push(data);
        window[this.storage].setItem(this.var,JSON.stringify(this.list));
    }

    // show the user's object in the variable 'users'
    getUser(user){
        let list = this.show();
        return list.find(el=>el.nick==user);
    }

    // delete localStorage/sessionStorage variable specified
    remove(){
        window[this.storage].removeItem(this.var);
    }
}

// This class is responsible of the dates' operators, increment y decrements dates 
export class DateOperators{
    constructor(){
        this.date = new Date();
        this.dateOperator = [ // get current date
            parseInt(this.date.getFullYear()),
            parseInt(this.date.getMonth()),
            parseInt(this.date.getDate()),
            parseInt(this.date.getHours()),
            parseInt(this.date.getMinutes()),
            parseInt(this.date.getSeconds()),
            parseInt(this.date.getMilliseconds())
        ];
    }

    increment(Year=Number,Month=Number,Day=Number,Hour=Number,Minute=Number,Seconds=Number,MSeconds=Number){
        let params = [Year,Month,Day,Hour,Minute,Seconds,MSeconds];
        for(let x=0;x<=this.dateOperator.length-1;x++){  
            (params[x]==-1)?this.dateOperator[x] = 0:this.dateOperator[x] += params[x];
        }
        return new Date(this.dateOperator[0],this.dateOperator[1],this.dateOperator[2],this.dateOperator[3],this.dateOperator[4],this.dateOperator[5],this.dateOperator[6]);
    }

    decrement(Year=Number,Month=Number,Day=Number,Hour=Number,Minute=Number,Seconds=Number,MSeconds=Number){
        let params = [Year,Month,Day,Hour++,Minute,Seconds,MSeconds];
        for(let x=0;x<=this.dateOperator.length-1;x++){  
            (params[x]==-1)?this.dateOperator[x] = 0:this.dateOperator[x] -= params[x];
        }
        return new Date(this.dateOperator[0],this.dateOperator[1],this.dateOperator[2],this.dateOperator[3],this.dateOperator[4],this.dateOperator[5],this.dateOperator[6]);
    }
}