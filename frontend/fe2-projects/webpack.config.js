const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv()
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    client: {
      webSocketURL: false  // 🔹 Disable WebSocket Client Injection
    },
    hot: false,           // 🔹 Disable Hot Module Replacement (HMR)
    liveReload: false     // 🔹 Disable Live Reload
  }
};
