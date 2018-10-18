// Execute lorsque l'iframe est charge
var url = window.location;
document.getElementById("barreRecherche").value = "HELLO";
if(url.indexof("?recherche") > 0) {
    var recherche = url.substring(recherche.indexof("?recherche") + 10);
    document.getElementById("resultat").innerHTML = "<p>Aucun résultat trouvé: " + recherche + "</p>";
}

function recherche() {
    var url = "http://www.labomba.bo"
    var query = document.getElementById("barreRecherche").value;
    document.getElementById("barreRecherche").value = "HELLO";
    if(query) {
        url += query;
    }
    window.location = url
}