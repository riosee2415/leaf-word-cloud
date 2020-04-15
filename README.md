# How to build

- yarn add --dev copy-webpack-plugin
- wenpack.config.js MODIFIED
<pre>
    plugins: [
    new CopyWebpackPlugin([
      {
        context: "./public",
        from: "*.*",
      },
    ]),
  ],
</pre>
- yarn add firebase-tools
- [terminal] : yarn build
- [terminal] : firebase init
- [terminal] : firebase deploy
