//INIT params BEGIN ---------------------
var data = {};
var host = "https://api.lafranceinsoumise.fr";
var routeApi = "/legacy/groups/";
var params1 = "?max_results=100&close_to=";
var km = 30000;
var codePostal = 69003;
var lat = Number("45.728113");
var lon = Number("4.877817");
var hostweb = 'https://agir.lafranceinsoumise.fr/';

$(document).ready(function () {
	//init first search on lyon :P
	getGroups(getUrl());
});

//INIT params ENDS ---------------------
function resetGroups() {
	$('#nb').empty();
	$('#groupes').empty();
}

function getUrl() {
	var coordinates = "[\"" + lon + "\",\"" + lat + "\"]";
	var params2 = "{\"max_distance\":\"" + km + "\",\"coordinates\":" + coordinates + "}";
	return host + routeApi + params1 + params2
}

function getRadioBtnValue() {
	var radios = document.getElementsByName('optKm');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
}

function search(byGeoloc) {
	document.getElementById("loading").style.display = "block";
	resetGroups();
	km = getRadioBtnValue();
	if (byGeoloc) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(searchWithPosition);
		}
		else {
			alert("Geolocation non supporté par votre navigateur");
		}
	}
	else {
		codePostal = document.getElementById('codePostal').value;
		if (!codePostal) {
			codePostal = "69003";
		} //by dedault LYON ;)
		reloadIframeOnCodePostal(codePostal);
		searchWithCodePostal(codePostal);
	}
}

function searchWithCodePostal(codePostal) {
	var host = "https://nominatim.openstreetmap.org/";
	var route = "/search/?format=json&q=";
	var url = host + route + codePostal + ",France";
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'json',
		success: function (data, statut) {
			if (data) {
				lat = data[0].lat;
				lon = data[0].lon;
				getGroups(getUrl());
			}
		}
	});
}

function searchWithPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	getPostalCodeFromGeoLoc(lat, lon);
	getGroups(getUrl());
}

function getPostalCodeFromGeoLoc(lat, lon) {
	var host = "https://nominatim.openstreetmap.org/";
	var route = "/search/?format=json&q=";
	var cp = /((2[A|B])|[0-9]{2})[0-9]{3}/;
	var url = host + route + lat + ',' + lon;
	$.ajax({
		url: url,
		method: 'GET',
		dataType: 'json',
		success: function (data, statut) {
			if (data) {
				codePostal = data[0].display_name.match(cp)[0];
				if (!codePostal) {
					codePostal = "69003";
				}
				reloadIframeOnCodePostal(codePostal);
			}
		}
	});
}

function addGroups(items) {
	$("#nb").append("<div class=\"col-12\" style='text-align: center;'>" + items.length + " groupes trouvés" + "</div>");
	items.forEach(function (group) {
		var certif = false;
		group.subtypes.forEach(function (subtype){
			if(subtype === 'certifié'){
				certif = true;
			}
		});
		$("#groupes").append(
			"<div class=\"col-12 wrapper\">"
				+"<div class=\"col-12 group "+(certif?"certif":"")+"\">"
					+"<a class='col-12 name' target=\"_blank\" href=\""+ hostweb + group.path + "\">" + group.name + "</a>"
					+(certif ? "<div class=\"badge\">Certifié</div>":"")
					+"<div class='col-12 contact'><b>" + group.contact.name +"</b>, "+group.contact.email + (group.contact.phone? ", "+group.contact.phone : "")+ "</div>"
					+"<div class='col-12 description'>"+group.description+"</div>"
					+"<div class=\"row justify-content-around\">"
						+"<a class='col-4 btn btn-outline-primary btn-sm' target=\"_blank\" href=\""+ hostweb + group.path + "\">"+"voir plus"+"</a>"
						+"<div class='col-4 btn btn-outline-danger btn-sm' onclick='reloadIframeOnIdEvent("+"\""+group._id+"\""+")'>"+"voir sur la carte"+"</div>"
					+"</div>"
				+"</div>"
			+"</div>"
		);
	});
	document.getElementById("loading").style.display = "none";
}

function getGroups(inputUrl) {
	console.log("get from ", inputUrl);
	$.ajax({
		url: inputUrl,
		method: 'GET',
		dataType: 'json',
		success: function (data, statut) {
			addGroups(data._items);
		}
	});
}

function reloadIframeOnCodePostal(zipcode) {
	console.log("reload ifram with codePostal=", zipcode);
	document.getElementById('mapframe').src = "";
	document.getElementById('mapframe').src = "https://carte.lafranceinsoumise.fr/?zipcode=" + zipcode + "&event_type=groups";
}

function reloadIframeOnIdEvent(id) {
	console.log("reload ifram on event=", id);
	document.getElementById('mapframe').src = "https://carte.lafranceinsoumise.fr/?&event_id=" + id + ",groups";
}

