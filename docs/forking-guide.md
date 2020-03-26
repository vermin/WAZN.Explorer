Forking WAZN Explorer
======================

### Styling

Put your logo in `/src/assets`. I might only be using `logo-color.png`.

Replace `/public/favicon.ico` with your own favicon.

Set your theme colors in `/src/theme.js`.

### Coin Config

Update `/src/config/config.js`.

### Daemon API

I'm pointing at a local daemon on one of seed nodes but feel free to use any Cloud function, which adds CORS and forwards requests to PHP API of your project.

All calls and response results should be in standard WAZN or Monero-style `json_rpc` format.
