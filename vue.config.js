module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8080,
    disableHostCheck: true,
    proxy: {
      "/product": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  }
}