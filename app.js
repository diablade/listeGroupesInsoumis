//INIT params BEGIN ---------------------
var data = {};
var urlinit= "https://api.lafranceinsoumise.fr/legacy/groups/?max_results=100&close_to={\"max_distance\":\"30000\",\"coordinates\":[\"4.877817\",\"45.728113\"]}";
var host = "https://api.lafranceinsoumise.fr";
var routeApi = "/legacy/groups/";
var paramsEmail = "?contact_email=";
var params1 = "?max_results=100&close_to=";
var km = 30000;
var codePostal = 69003;
var lat = Number("45.728113");
var lon = Number("4.877817");
var hostweb = 'https://agir.lafranceinsoumise.fr/';

$(document).ready(function () {
	//init first search on lyon :P
	getGroups(urlinit);
});

//INIT params ENDS ---------------------
function resetGroups() {
	$('#nb').empty();
	$('#groupes').empty();
}

function getUrl() {
	return host + routeApi + paramsEmail;
}


function search() {
	document.getElementById("loading").style.display = "block";
	resetGroups();

	var email = document.getElementById('email').value;
	if (!email) {
	}
	else{
		getGroups(getUrl()+email);
	}
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

