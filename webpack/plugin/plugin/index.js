class CopyRightWebpackPlugin {
    // constructor(options){ //options 插件传递的参数 peter
    //     console.log(options.name)
    // }
    apply(compiler){ // 可以理解为 webpack 实例
        // compiler.hooks.someHook.tap('MyPlugin', (params) => { 同步用法
        //     /* ... */
        // });
        // compiler.hooks.someHook.tapAsync('MyPlugin', (params, callback) => { // 异步钩子用法,记得加 callback
        //     /* ... */
        //     callback();
        // });
        compiler.hooks.compile.tap('CopyRightWebpackPlugin',(compilationParams)=>{
            debugger;
            console.log(compilationParams)
        })
        compiler.hooks.emit.tapAsync('CopyRightWebpackPlugin',(compilation,cb)=>{
            // compilation 本次打包相关的东西 compiler，所有的东西
            compilation.assets['copyright.js']={ // 文件源码和大小
                source: function () {
                    return "console.log('webpack was glad to meet me')"
                },
                size: function () {
                    return 38
                }
            }
            cb()
        })
    }
}

module.exports = CopyRightWebpackPlugin

// 当调用这个插件是 会执行 apply 方法
