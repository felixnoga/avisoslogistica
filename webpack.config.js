var webpack = require("webpack");
module.exports = {
    entry: {
        programador: "./src/js/programador.js",
        almacen: "./src/js/almacen.js",
        montaje: "./src/js/montaje.js",
        inspecciones: "./src/js/inspecciones.js"
    },
    output: {
        path: __dirname+"/js",
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]

};