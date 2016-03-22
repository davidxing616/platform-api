var colors = {
	hover: 0xcccccc,
	select: 0x0000ff,
	backgroundColor: 0xffffff
}

// Set Three.js scene
var venue

var venueId
var mapView
var cavas

// var numAPICalls = 6

// This doesn't handle errors at all right now
function init(venueId) {

	venue = new MappedIn.Venue(venueId, initPostVenueLoaded)
}

function initPostVenueLoaded() {

	canvas = document.getElementById( 'mapView' );
	mapView = new MappedIn.MapView(canvas, venue, initPostMapLoaded)

}

function initPostMapLoaded() {

	mapView.createMarker("Test", 0, "location-label")

}


