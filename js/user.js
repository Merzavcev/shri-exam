var rawStudentsJson = [];
var rawLectorsJson = [];
var flags = [];

$.when( 
    $.getJSON('json/students'),
    $.getJSON('json/lectors'),
    $.getJSON('json/static')
)
.done(
function(a1,a2,a3){
var StudentsJson = a1[0],
    LectorsJson = a2[0],
    menuJson = a3[0];

    var ViewModel = function () {
        var self = this;

        self.currentPageId = ko.observable(1);

        self.students = StudentsJson;
        self.lectors = LectorsJson
        self.mainmenu = menuJson;

        self.goToPageId = function (id) {
            self.currentPageId(id);
/*            self.mainmenu.forEach(function(item) {
                if (item.id === id) {
                }
            })*/
        }


    }
    ko.applyBindings(new ViewModel());
});