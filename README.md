# Spotify "Freshlist" - </salt> 1-day hackathon

1 Day project made for </salt> hackathon. Requirements were to implement an Express back-end and React front-end.

This application is intended for Spotify Playlist Curators. 

When playlist curators have a lot of playlists to keep track of, It can become quite mundate to keep the "Date Added" up-to-date in order to give the illusion of a playlist being fresh and featuring the "latest and greatest". Spotify offers no native way to solve this, as their endpoints state that ["When reordering items, the timestamp indicating when they were added and the user who added them will be kept untouched."](https://developer.spotify.com/documentation/web-api/reference/playlists/reorder-playlists-tracks/).

This application solves that problem by fetching playlists owned by the logged in user, and presents an option to refresh the tracks within the playlist. Clicking the refresh button prompts a chain of GET, DELETE and POST requests in order to successfully refresh the "Date added" indicator of upto 50 tracks in the playlist, giving new listeners the illusion that the playlist is relevant to listen to as it's not featuring "outdated" music.

The application has a lot of room for improvement, mainly expanding on functionality, implementing extensive error handling, refactoring into Redux, and improving the user flow, but at the core of it the application works as intended and performs it's intended functionality.

Special thanks to [Youri Gruiters](https://github.com/yourigruiters) for being a helpful sounding board during the project!

## Image:
![Image1](/app.jpg)
![Image2](/demonstration.jpg)
