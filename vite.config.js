// vite.config.js
export default {
 
    plugins: [
        vue(),
        vuetify({
        styles: { configFile: "styles/main.scss" }
        })
    ]
}