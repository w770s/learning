import * as _ from 'lodash';

class Greeter{
    greeting: string;
    constructor(message: string){
        this.greeting = message
    }
    greet(){
        // return 'hello' + this.greeting
        return _.join(['hello,',this.greeting],'-')
    }
}

let greeter = new Greeter('world')
console.log(greeter.greet())
