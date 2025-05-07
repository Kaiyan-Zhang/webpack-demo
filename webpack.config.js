import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: ['...', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ['style-loader', '@teamsupercell/typings-for-css-modules-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  devServer: {},
}

export default config;
