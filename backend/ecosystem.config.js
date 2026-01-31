// PM2 ecosystem file for process management

module.exports = {
  apps: [{
    name: 'doc-converter-api',
    script: 'src/app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false,
  }],
}
