封装MongoDB 库之前的一些准备操作 es5，es6，class 类，静态方法，以及单例模式



1. 原生js中类，静态方法和继承

一般 构造函数和原型链是一起使用的， 一个保护私有变量， 一个更快，所有实力都能访问
function Person(name,age) {
    // 构造函数上面的方法属性： 会在它的每一个实例上都克隆这个方法，般是因为我们需要访问构造函数内部的私有变量 .
    this.name = name
    this.age = age
    this.run = function () {
        console.log(`${this.name}` + '--' + `${this.age}`);
    }
}
// 原型链上面的方法属性： 可以被多个实例共享，但是不会在每个实例的内部重新定义这个方法，
// 如果我们的应用需要创建很多新的对象,并且这些对象还有许多的方法,为了节省内存,
// 注意点：如果你改变某个方法,那么由这个构造函数产生的所有对象的那个方法都会被改变，变量提升
// 对象序列化：prototype 上的属性不会被序列化（也就是不可枚举属性）
Person.prototype.sex = 'boy'
Person.prototype.work = function () {
    console.log(`${this.name}` + '--' + `${this.age}`+ '--' + `${this.sex}`);
}

// 在es5 中 原型链和构造函数上的方法都是实例的方法 ，要使用的话需要想实例化类 new


// 静态方法： 直接绑定到实例上
Person.setName = function () {
    console.log('静态方法')
}

const person1 = new Person('xla','22')
console.log(JSON.stringify(person1));
// {"name":"xla","age":"22"} 没有 sex  // 对象序列化：prototype 上的属性不会被序列化

person1.run()
person1.work()

Person.setName()
执行静态方法


es5 继承
function Person(name,age) {
    this.name = name
    this.age = age
    this.run = function () {
        console.log(`${this.name}` + '--' + `${this.age}`);
    }
}

Person.prototype.setName = function () {
    console.log(this.name, this.age);
}

function Inheritance(name,age) { // 1。借用构造函数继承,对象冒充实现继承，无法复用（原型链上的无法继承）
    console.log(this); // {}
    Person.call(this,name,age) // 把上下文的this,绑定到相关函数上
    console.log(this); // Inheritance { name: 'xla', age: 22, run: [Function] }
}

const a = new Inheritance('xla',22)


function Inheritance(name,age){
    Person.call(this,name,age)
}

Inheritance.prototype = new Person()  // 3 原型链继承 + 构造函数继承 + 组合，
优点（解决的问题）： 1.可以实现原型链的继承， 2.子类可以给父类传值
缺点： 生成了两个实例： 一个父类，一个子类

Inheritance.prototype = Object.create(Person.prototype); // 4。 完美（寄生组合）： 解决了，生成两个实例
Inheritance.prototype.constructor  = Inheritance; //增强对象;Person  创建的对象是使用哪个构造器就用哪个！但是一般继承后都是用自己的构造器！

const  a = new Inheritance('xla', 2) // 2。单独的原型链继承， 实例化子类是无法给父类传参， 一修改全部修改

console.log(a);


4。原型式继承， 寄生式继承， 寄生组合式继承（推荐）

5. 原型式继承 实现思路：
实现思路就是将子类的原型设置为父类的原型

	// 父类
function SuperType (name) {
  this.colors = ["red", "blue", "green"];
  this.name = name; // 父类属性
}
SuperType.prototype.sayName = function () { // 父类原型方法
  return this.name;
};

/** 第一步 */
// 子类，通过 call 继承父类的实例属性和方法，不能继承原型属性/方法
function SubType (name, subName) {
  SuperType.call(this, name); // 调用 SuperType 的构造函数，并向其传参 
  this.subName = subName;
}

/** 第二步 */
// 解决 call 无法继承父类原型属性/方法的问题
// Object.create 方法接受传入一个作为新创建对象的原型的对象，创建一个拥有指定原型和若干个指定属性的对象
// 通过这种方法指定的任何属性都会覆盖原型对象上的同名属性
SubType.prototype = Object.create(SuperType.prototype, { 
  constructor: { // 注意指定 SubType.prototype.constructor = SubType
    value: SubType,
    enumerable: false,
    writable: true,
    configurable: true
  },
  run : { 
    value: function(){ // override
      SuperType.prototype.run.apply(this, arguments); 
      	// call super
      	// ...
    },
    enumerable: true,
    configurable: true, 
    writable: true
  }
}) 

/** 第三步 */
// 最后：解决 SubType.prototype.constructor === SuperType 的问题
// 这里，在上一步已经指定，这里不需要再操作
// SubType.prototype.constructor = SubType;

var instance = new SubType('An', 'sistenAn')


6.多继承 如果希望能 多继承 ，可使用 混入 的方式

// 父类 SuperType
function SuperType () {}
// 父类 OtherSuperType
function OtherSuperType () {}

// 多继承子类
function AnotherType () {
    SuperType.call(this) // 继承 SuperType 的实例属性和方法
    OtherSuperType.call(this) // 继承 OtherSuperType 的实例属性和方法
}

// 继承一个类
AnotherType.prototype = Object.create(SuperType.prototype);

// 使用 Object.assign 混合其它
Object.assign(AnotherType.prototype, OtherSuperType.prototype);
// Object.assign 会把  OtherSuperType 原型上的函数拷贝到 AnotherType 原型上，使 AnotherType 的所有实例都可用 OtherSuperType 的方法

// 重新指定 constructor
AnotherType.prototype.constructor = AnotherType;

AnotherType.prototype.myMethod = function() {
     // do a thing
};

let instance = new AnotherType()


最重要的部分是：
SuperType.call 继承实例属性方法
用 Object.create() 来继承原型属性与方法
修改 SubType.prototype.constructor的指向



2. es6中类，静态方法和继承

class Person{  // es6中类，属性方法
    constructor(name,age){ // 构造函数实例化是执行
        this.name = name
        this.age = age
    }
    getName(){
        console.log(this.name);
    }
    getAge(){
        console.log(this.age);
    }
}


es6继承

class Web extends Person{
    constructor(name,age,sex){
        super(name,age) // 实例化子类的时候把子类的数据传给父类
        this.sex = sex // 自己的属性
    }

    print(){
        console.log(this.name,this.age,this.sex);
    }

}


const a = new Web('xla',12, 'boy')


a.getName()
a.getAge()
a.print()


es6 静态方法

class Person{
    constructor(name) {
        this.name = name
    }
    run(){ // 实例方法
        console.log(this.name);
    }
    static work(){
        // this.name === 构造函数的名字
        console.log(this.name+'q23112');
    }
}
Person.es5Static = function () {
    console.log('es5静态方法');
}


const a = new Person('xla')

a.run()

Person.work()
Person.es5Static()




3.es6 中单例模式: 无论实例化多少次，构造函数只执行一次

class Db{
    static GetInstance(){
        if(!Db.instance){ // 价格判断
            Db.instance = new Db()
        }
        return Db.instance
    }
    constructor(name){
        this.name = name
        this.getName()
    }
    getName(){
        console.log('实例化开始');
    }
    endName(){
        console.log('实例化结束');
    }
}

// const a = new Db('A')
// const b = new Db('B')

Db.GetInstance()
Db.GetInstance()
Db.GetInstance()





