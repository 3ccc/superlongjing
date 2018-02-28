var webpack = require("webpack");
webpack({
    entry:{
        'jlongjing':'./index.js',
        'jlongjing.min':'./index.js'
    },
    output: {
        path: __dirname,
        filename: "dist/[name].js",
        library:"longjing",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
       // new webpack.optimize.UglifyJsPlugin({
       //     compress: {warnings: false},
       //     except: ['$super', '$', 'exports', 'require']
       // })
    ]
},function(){
	
});