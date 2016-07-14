var host = {
	search: "https://search.mappedin.com"
	//search: "http://localhost:8080"
}

var key = {
	id: 'blah',
	secret: 'blah'
}

//var venue = 'sherway-gardens';
var venue = 'vaughan-mills';
var resultsPerPage = 10;
var currentPage = 1;

var api = {

	Search: function (venue, data, cb) {
		var objects;
		function getObjects(url, cb) {
			$.ajax({
				url: url,
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa(key.id + ":" + key.secret));
				},
				success: cb
			});
		}

		function handleResponse(data, statusText, xhr) {
			cb(data, statusText, xhr);
		}

		var url = host.search + '/' + venue + '/search';
		if (data) {
			url += '?' + $.param(data);
		}
		getObjects(url, handleResponse);
	},

	Suggest: function (venue, data, cb) {
		var objects;
		function getObjects(url, cb) {
			$.ajax({
				url: url,
				type: 'GET',
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa(key.id + ":" + key.secret));
				},
				success: cb
			});
		}

		function handleResponse(data, statusText, xhr) {
			cb(data, statusText, xhr);
		}

		var url = host.search + '/' + venue + '/suggest';
		if (data) {
			url += '?' + $.param(data);
		}
		getObjects(url, handleResponse);
	}

};


function init (token) {
	map.init(venue, 'Perspective', token, function () {
		//console.log("initialized");
		$('#map').addClass('hidden');

	});


	$("#search").keydown(function(event){
	    if(event.keyCode == 13) {
	      if($("#search").val().length > 0) {
	      	searchAndDisplayResults($("#search").val().trim(), 1, function (results) {
	      		setupPager(results.total, resultsPerPage, 1);
	      	});
	        event.preventDefault();
	        return false;
	      }
	    }
	 });

	$( "#search" ).autocomplete({
		delay: 100,
		autoFocus: false,
		source: function (request, response) {
			var value = request.term;

			if (value.trim().length == 0) {
				return response([]);
			}

			api.Suggest(venue, {q: value}, function (results) {
		   		var terms = []

		   		if (results.total) {
		   			var hits = results.hits;
		   			hits.forEach(function (item) {
		   				terms.push(item.text);
		   			});


		   		}

		   		response(terms);

			});

		}/*
			//don't need this anymore.. the enter key is handling this
		,
		select: function (event, ui) {
			var value = ui.item.value;

			searchAndDisplayResults(value, 1);
		}*/

	});

	$("#venue-selector").selectmenu();
	$("#venue-selector").on("selectmenuchange", function (event, ui) {
		//console.log(ui.item.value);
		venue = ui.item.value;
		map.init(venue, 'Perspective', token, function () {
			console.log("initialized");
			//$('#map').addClass('hidden');
		});
		searchAndDisplayResults($("#search").val().trim(), 1, function (results) {
      		setupPager(results.total, resultsPerPage, 1);
      	});
	});


	$("#search").focus();

}

function setupPager (total, pageSize, pageNumber) {
	if (total == 0) {
		$('.pagination').addClass('hidden');
		return;
	}
	$('.pagination').removeClass('hidden');

	$(".pagination").paging(total, {
	    format: '[< nnnncnn >]',
	    perpage: pageSize,
	    lapping: 0, // don't overlap pages for the moment
	    page: pageNumber, // start at page, can also be "null" or negative
	    onSelect: function (page) {
	    	$("[id^=page-]").removeClass('active');
	    	$("#page-" + page).addClass('active');

	    	$('#page-prev').removeClass('hidden');
	    	$('#page-next').removeClass('hidden');

	    	if (page == 1) {
	    		$('#page-prev').addClass('hidden');
	    	}

	    	if (page == this.pages) {
	    		$('#page-next').addClass('hidden');

	    	}

	    	//if page is already on the current page, then don't call search api
	    	if (page == currentPage) return;
			searchAndDisplayResults($("#search").val().trim(), page, function (results) {
				window.scrollTo(0,0);
			});
	    },
	    onFormat: function (type) {
	        switch (type) {
	        case 'block': // n and c
	            return '<a href="#" id="page-'+ this.value + '">' + this.value + '</a>';
	        case 'next': // >
	            return '<a href="#" id="page-next">&gt;</a>';
	        case 'prev': // <
	            return '<a href="#" id="page-prev">&lt;</a>';
	        case 'first': // [
	            //return '<a href="#">first</a>';
	            return '';
	        case 'last': // ]
	            //return '<a href="#">last</a>';
	            return '';
	        }
	    }
	});
}

function formatEventForSideBar(item) {

	var html = '<div class="side-row-event">';

	if (item.image && item.image.small) {
		html +='<div class="image"><img src="' + item.image.small+ '"></div>';
	}

	html += '<div class="name">' + item.name + '</div>';
	html += '<div class="description">' + item.description + '</div>'
	var endDate = new Date(item.endDate);
	html += '<div class="endDate">ends: ' + endDate.toLocaleString('en', {weekday: 'long', month: 'long', day: 'numeric'}) + '</div>';

	html += '</div>';

	return html;
}

function formatHours(hours) {
	var format = 'HH:mm';
	var opens = moment(hours.opens, format);
	var closes = moment(hours.closes, format);

	if (opens === '00:00' && closes === '00:00') {
		return 'CLOSED';
	}

	return opens.format('hh:mmA') + ' - ' + closes.format('hh:mmA');
}

function formatLocationForSideBar(item) {

	var html = '<div class="side-row-location">';

	html += '<div class="header">';



	html += '<div class="right">';

	html += '<div class="name">' + item.name + '</div>';
	item.categories.forEach(function (category) {
		html += '<div class="category">' + category.name + '</div>';
	});

	html += '</div>';

	if (item.logo) {
		if (item.logo.small) {
			html +='<div class="logo"><img src="' + item.logo.small+ '"></div>';
		} else if (item.logo.original) {
			html +='<div class="logo"><img src="' + item.logo.original+ '"></div>';
		}
	}

	html += '</div>';

	html += '<div class="description">' + item.description + '</div>'


	var hours = {};

	if (item.operationHours){


		item.operationHours.forEach(function (operationHour) {
			if (operationHour.dayOfWeek) {
				operationHour.dayOfWeek.forEach(function (day){
					hours[day]={
						opens: operationHour.opens,
						closes: operationHour.closes
					}
				});

			}
		});

		html += '<div class="hours">';
		html += '<div class="day">Monday:</div>';
		html += '<div class="hour">' + formatHours(hours.Monday) + '</div>';
		html += '</div>';

		html += '<div class="hours">';
		html += '<div class="day">Tuesday:</div>';
		html += '<div class="hour">' + formatHours(hours.Tuesday) + '</div>';
		html += '</div>';

		html += '<div class="hours">';
		html += '<div class="day">Wednesday:</div>';
		html += '<div class="hour">' + formatHours(hours.Wednesday) + '</div>';
		html += '</div>';

		html += '<div class="hours">';
		html += '<div class="day">Thursday:</div>';
		html += '<div class="hour">' + formatHours(hours.Thursday) + '</div>';
		html += '</div>';

		html += '<div class="hours">';
		html += '<div class="day">Friday:</div>';
		html += '<div class="hour">' + formatHours(hours.Friday) + '</div>';
		html += '</div>';

		html += '<div class="hours">';
		html += '<div class="day">Saturday:</div>';
		html += '<div class="hour">' + formatHours(hours.Saturday) + '</div>';
		html += '</div>';

		html += '<div class="hours">';
		html += '<div class="day">Sunday:</div>';
		html += '<div class="hour">' + formatHours(hours.Sunday) + '</div>';
		html += '</div>';
	}
	html += '</div>';

	return html;
}

function searchAndDisplayResults(value, pageNumber, cb) {
	cb = cb ? cb : function (){};
	currentPage = pageNumber;
	api.Search(venue, {q: value, ps: resultsPerPage, pn: pageNumber}, function (results) {
   		var htmlContent = '<div>Total: ' + results.total + '</div>';
   		var sideHtml = '';
   		map.clearHighlightPolygons();

   		if (results.total) {

   			var hits = results.hits;


   			hits.forEach(function (item) {


   				var html = '<div class="results-row">';
   				if ((item.assetType === 'location')) {
   					html += '<div class="name">' + item.name + '</div>';
 	  				html += '<div class="description">' + item.description + '</div>';

 	  				if(item.tags) {
	   					var tagsHtml = '';
		   				item.tags.forEach(function (tag){
		   					tagsHtml += tagsHtml === '' ? '' : ' | ';

		   					tagsHtml += tag + '&nbsp;';
		   				});

		   				html += '<div class="tags">' + tagsHtml + '</div>';
		   			}


		   			if (item.score > 4 || hits.length == 1) {
		   				if (map.locationHasPolygons(item.id)) {
							$('#map').removeClass('hidden');
							map.highlightLocation(item.id);
						} else {
							$('#map').addClass('hidden');

						}
						sideHtml += formatLocationForSideBar(item);

		   			}
   				} else if (item.assetType === 'event') {
   					sideHtml += formatEventForSideBar(item);
   				}

   				html += '</div>';

   				htmlContent += html;
   			});

   			//sideHtml += '</div>';

   		}

   		if (sideHtml.length == 0) {
   			$('#map').addClass('hidden');
   		}
   		$('#side').html(sideHtml);
   		$('#results').html(htmlContent);
   		cb(results);
	});
}
