module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './app.js',
      watch: true,
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
}