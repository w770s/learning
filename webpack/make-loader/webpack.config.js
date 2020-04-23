const path = require('path');

module.exports={
    mode: 'development',
    entry:{
        main: './src/router.js',
    },
    resolveLoader:{ // 解析 loader 规则 先node_modules 在 ./loader
        modules:['node_modules','./loaders']
    },
    module:{
        rules:[{
            test: /\.js/,
            // use:[
            //         {
            //             loader: path.resolve(__dirname,'./loaders/replaceLoader.js')
            //         },
            //         {
            //             loader: path.resolve(__dirname,'./loaders/replaceAsync.js'),
            //             options:{
            //                 name: 'peter'
            //             }
            //         }
            // ] // 调用本地写的loader
            use:[
                {
                    loader: 'replaceLoader'
                },
                {
                    loader: 'replaceAsync',
                    options: {
                        name: 'peter'
                    }
                }
            ] // 调用本地写的loader
        }]
    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}
