# Raayan Pillai Jobcoin Mixer Webapp

Small UI I built with react-create-app for interfacing with the [Mixer Server](https://github.com/raayanpillai/jobcoin-mixer)

See the documentation [there](https://github.com/raayanpillai/jobcoin-mixer) for more details.

## Usage
### `npm start`
Start the development server on port 3000, but I configured it to proxy on 8080 
to ignore CORs related issues when developing.

Running the Java application and then `npm start` would be the simplest way to get this 
project up and running  

### `npm run build`
Bundles the Typescript and Javascript files and places them in `/build`
This was done before moving the files to the `/static` directory in the
main server application.
