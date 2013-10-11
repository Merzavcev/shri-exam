var rawStudentsJson = [];
var rawLectorsJson = [];
var flags = [];

/*function timeout(time) {
    var promise = new $.Deferred();

    setTimeout(promise.resolve, time);
    return promise;
}*/
$.when( 
    $.getJSON('json/students'),
    $.getJSON('json/lectors')
)
.done(function(a1,a2){
    rawStudentsJson = a1[0];
    rawLectorsJson = a2[0];
    var SHRI = {
        students : rawStudentsJson,
        lectors : rawLectorsJson
    }    
    ko.applyBindings(SHRI);
});