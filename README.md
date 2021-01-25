# Spotify-currentlyPlaying-scraping

This script makes it possible automate the process of getting a bearer token which is needed to fetch data from the [Spotify API](https://developer.spotify.com/documentation/web-api/). The data that this script fetches is the current music playing from the user's Spotify account such as song name and album picture, other data that can be requested is for example if the song is playing, song length and more. Bearer token expires after one hour so the playwright scripts get executed after each hour and the data fetching from Spotify occurs each 5 second (can be lowered or higher).


## Running Locally

```
1. git clone https://github.com/bajramdev/spotify-currentlyPlaying-scraping.git
2. npm install
3. node spotify.js
```

input username and password in [.env file](https://github.com/bajramdev/spotify-currentlyPlaying-scraping/blob/master/.env) of your spotify login info


## Libraries Used

* [Playwright](https://github.com/microsoft/playwright)

* [Node-fetch](https://github.com/node-fetch/node-fetch)
