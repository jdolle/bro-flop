export default {
  plugins: [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-proposal-object-rest-spread",
  ],
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": "last 2 Chrome versions"
        }
      }
    ]
  ],
}
