const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser') // 读取 AST 抽象语法树
const traverse = require('@babel/traverse').default //遍历  AST 抽象语法树
const babel = require("@babel/core");

const MoudleAnalyse=(filename)=>{
    const content = fs.readFileSync(filename,'utf-8')
    const parseAST = parser.parse(content,{
        sourceType: "module"
    })
    const dependencies = {} // 分析文件的 相对路径和绝对路径
    traverse(parseAST,{ // ast ImportDeclaration（导入模块对应关系） 处理函数
        ImportDeclaration({node}){ // traverse 相当于遍历 AST 找到 ImportDeclaration（导入模块对应关系）操作
            const rootPath = path.dirname(filename)
            const absolutePath = './' + path.join(rootPath,node.source.value)
            dependencies[node.source.value] = absolutePath
        }
    })
    const { code } = babel.transformFromAst(parseAST,null,{ // presets babel 插件集合
        "presets":["@babel/preset-env"]
    })
    return{
        filename, // 一个文件
        dependencies, // 模块依赖关系
        code // babel 转换成浏览器识别 es5
    }
}

const MouduleAnalyseGraph = (entry) =>{ // 所有文件的依赖图谱
    const entryMoudle = MoudleAnalyse(entry)
    const entryModuleArray = [entryMoudle]
    for(let i=0;i<entryModuleArray.length;i++){
        const everyEntry = entryModuleArray[i]
        const { dependencies } = everyEntry // 结构赋值
        for(let j in dependencies){
            const anotherEntry = dependencies[j]
            entryModuleArray.push(MoudleAnalyse(anotherEntry))
        }
    }
    const graph = {} // []=>{}
    entryModuleArray.forEach(item=>{
        graph[item.filename]={
            dependencies:item.dependencies,
            code:item.code
        }
    })
    return graph
}

const ModuleAnalyseToString=(entry)=>{
    const graph = JSON.stringify(MouduleAnalyseGraph(entry))
    //code 中 exports 和 require 浏览器无法处理，自己处理 // 闭包，避免污染全局
    return `
         (function(graph){ 
            function require(entry){
                function localrequire(relativePath){
                    return require(graph[entry].dependencies[relativePath]);
                }
                var exports = {};
                (function(require,exports,code){
                    eval(code)
                })(localrequire,exports,graph[entry].code)
                return exports;
            };
            require('${entry}')
        })(${graph})
    `
}

const analyseResult = ModuleAnalyseToString('./src/index.js')

console.log(analyseResult) // helloWorld

// @babel/traverse 快速找到 AST node (节点)

// 打包配置文件 读取 ，处理
//
// AST
//     [ Node {
//     type: 'ImportDeclaration',
//         start: 0,
//         end: 34,
//         loc: SourceLocation { start: [Position], end: [Position] },
//     specifiers: [ [Node] ],
//         source:
//     Node {
//         type: 'StringLiteral',
//             start: 20,
//             end: 34,
//             loc: [SourceLocation],
//             extra: [Object],
//             value: './message.js' } },
// Node {
//     type: 'ExpressionStatement',
//         start: 36,
//         end: 56,
//         loc: SourceLocation { start: [Position], end: [Position] },
//     expression:
//         Node {
//         type: 'CallExpression',
//             start: 36,
//             end: 56,
//             loc: [SourceLocation],
//             callee: [Node],
//             arguments: [Array] } } ]

