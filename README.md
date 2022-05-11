[![wakatime](https://wakatime.com/badge/github/eErr0Re/connect-4.svg)](https://wakatime.com/badge/github/eErr0Re/connect-4)
# connect4
A simple web game made with Node.js

## Installation
Prerequisites:
* Node.js
* npm

Install dependencies using
```Shell
npm install
```

## Initialisation

You can set the port numbers in config.json

Start the server using:
```Shell
npm start
```

### Using system ports

System (well-known) ports are port numbers in the range from 0 to 1023. You can redirect these ports to the ports your server is listening on.

To redirect ports:
```Shell
sudo iptables -t nat -I PREROUTING -p tcp --dport <system port> -j REDIRECT --to-ports <server port>
```
To redirect ports for localhost:
```Shell
sudo iptables -t nat -I OUTPUT -p tcp -o lo --dport <system port> -j REDIRECT --to-ports <server port>
```

### Using HTTPS

To enable HTTPS, modify config.json:
```JSON
"https": true,
"key": "<path to your private key>",
"cert": "<path to your certificate>"
```
