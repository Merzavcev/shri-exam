var rawStudentsJson;

$.getJSON('json/students', function(data) { rawStudentsJson = data;})
.done(function() {

/*var MStudent = function () {
    this.href = 'http://ya.ru/'
    this.img_src = 'data/faces/students/polyukhovich.jpg';
    this.first_name = 'Иван';
    this.last_name = 'Полюхович';
}*/
    var MStudents = function () {
        this.students = rawStudentsJson;
    }
    ko.applyBindings(new MStudents);
})
.fail(function() {
    console.log( "Coundn't get JSON");
})