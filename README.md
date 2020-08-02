
# MPV web frontend

Frontend for the `mpv-web-api`.

Written in svelte with typscript.

## Running

Currently only hosting using `sirv` is supported - `npm run dev` will run the application on the localhost with default port of `5000`. For hosting the bundle in the http server `npm run build` can be used.

For app to do anything `mpv-web-api` has to be running somwhere on the network and be accessible from the place the app is ran.

## Usage

At the moment not much is in a working state - everything is more or less in a Work In Progress/Proof of Concept state. It's more of a toy to tinker with instead of something usable. <sub><sup><sub><sup>At the very least I can watch Hidamari Sketch from my couch by controlling the `mpv` from my smartphone</sub></sup></sub></sup>

App by default tries to communicate with the backend (`mpv-web-api`) on a `localhost:3001` address. If app can't successfully communicate with the backend, the prompt with an input will be presented asking for a new address.
