MappedIn Website Integration Example
========

This example illustrates how to invoke MappedIn REST API and use Leaflet to display a map.  It also demonstrates map interactions through a dropdown that lists all locations by categories.  The sample uses twitter bootstrap to simplify layout and css styles.

## Getting Started

Before you can make REST calls to MappedIn API, you need to retrieve a token by authenticating with your client key and secret. For testing purposes, you can use `token fetcher/token.html`, but in a production application you will need to implement a call to your servers to retrieve the current token.

For now, open 'token.html' and enter your set of key and secret and hit submit. Copy and paste the result into the `token` property of `sample.html` (not `sample.js`). Also, change the venueId to the venue you are accessing.  Set the perspective name as well.  If you don't know what perspective name to use, contact us and we'll let you know.

```javascript
    var perspectiveName = "Main Kiosk";
    var venueId = 'mappedin-mall';
    // Authenticate with the API keys with the MappedIn server
    var grant = { 
      grant_type: "client_credentials", 
      // You will need to request your own API client and secret keys by contacting support@mappedin.ca, and use token.html to retrieve your token
     token: {paste your token here}
    };
```

Start the demo by opening the `sample.html` file in your browser.

## API v1 Documentation

[Get V1 documentation here](../../v1.md)    	   
