const mix = require('laravel-mix');
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({

    output: {
        chunkFilename: "js/e86691c3/[chunkhash:8].js",
    },    

    module:{
        rules: [
            {
                test: /.*wasm\.bin$/,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, "src"),
                loader: "ts-loader",
            },
        ],
    }
})
    
mix.postCss('resources/css/app.css', 'public/css', [
    require('tailwindcss'),
]);

mix.postCss('resources/css/roboto.css', 'public/css')

// output untuk app
mix.ts("resources/js/RoyalSPBU/index.tsx","public/js/e86691c3")
    .react()

mix.version()

mix.browserSync('localhost:8000')