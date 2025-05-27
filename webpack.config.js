const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";
const devtool = devMode ? "source-map" : undefined;

module.exports = {
    target,
    mode,
    devtool,
    entry: path.resolve(__dirname, "src", "index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        clean: true,
        filename: "js/index.js",
        assetModuleFilename: "assets/[hash][ext][query]",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.css",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: 'html/index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'elements.html'),
            filename: 'html/elements.html'
        }),
    ],
    resolve: {
        alias: {
            SIGHT: path.resolve(__dirname, "src", 'assets'),
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                generator: {
                    filename: "js/[name][hash][ext][query]",
                },
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                generator: {
                    filename: "css/[name][hash][ext][query]",
                },
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [require("postcss-preset-env")]
                            }
                        }
                    },
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jpeg|gif|svg|jpg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][hash][ext][query]"
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][hash][ext][query]"
                }
            }
        ]
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist"),
        },
        compress: true,
        port: 8080,
        open: ['/html/index.html'],
        watchFiles: ['src/**/*'],
    },
};
