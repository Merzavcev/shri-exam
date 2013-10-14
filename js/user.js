/**
 * Модуль SHRI. Содержит всю логику приложения выпускного альбома
 */
;
'use strict';
var SHRI = SHRI || {};
/**
 * Создает пространство имён. Функция позаимствована из книги С. Стефанов «Javascript шаблоны»
 * @param  {string} ns_string Содержит шаблон, по которому строится структура объекта
 * @return {object}           Крайний объёкт в цепочке
 */
SHRI.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = SHRI,
        i;

    if (parts[0] === "SHRI") {
        parts = parts.slice(1)
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}

SHRI.namespace('modules.util');


SHRI.namespace('modules.menu');
SHRI.namespace('modules.statical');
SHRI.namespace('modules.lectors');
SHRI.namespace('modules.lections');
SHRI.namespace('modules.students');

SHRI.namespace('vm.selected'); 
/**
 * util - модуль вспомогательных функций
 */
SHRI.modules.util = (function () {
    return {
        selectById : function (a,id) {
            return a.filter(function(i) {
                return i.id === id;
            })[0]
        },
        selectByPath : function (a,path) {
            return a.filter(function(i) {
                return i.path === path;
            })[0]
        },
        buildPath : function(path) {
            return '#!/' + path;
        },
        /**
         * Возвращает навигационные хэши. Кандидат на удаление
         * @param  {string} href 
         * @return {string}      
         */
        parsePath : function(href) {
            return href.split('#!/')[1];
        },
        /**
         * Парсинг строки адреса.
         * @param  {string} href приходит location.href
         * @return {array}       возвращаем массив, интересуют значения с 1 по 3
         */
        parsePathReg : function(href) {
            /**
             * В первой группе всегда имя страницы.
             * Во второй - может быть идентификатор (например, лектора, лекции или студента)
             * В третьей - может быть модификатор (для кастомных View)
             * Ожидаемая структура строки:   :#!/page_name/item:mod 
             * @type {RegExp}
             */
            var parse_url = /(?:#!\/)([0-9.A-za-z-]+\/)(?:(\d+$))?:?(?:([0-9.A-za-z-]+)?)$/,
                result = parse_url.exec(href);
            return result;
        }
    }
}()); 

SHRI.modules.menu = (function () {

    var data,
        promise = new $.Deferred();

    $.getJSON('json/menu.json')
    .done(function (a) {
        data = a;
        promise.resolve();
    })
    .fail(function () {
        console.log('Не удалось загрузить данные');
        promise.reject();
    });

    return {
        promise : function () {
            return promise;
        },
        json : function () {
            if (data !== "undefined") return data;
        }
    }
}());

SHRI.modules.statical = (function () {

    var data,
        promise = new $.Deferred();

    $.getJSON('json/static.json')
    .done(function (a) {
        data = a;
        promise.resolve();
    })
    .fail(function () {
        console.log('Не удалось загрузить данные');
        promise.reject();
    });

    return {
        promise : function () {
            return promise;
        },
        json : function () {
            if (data !== "undefined") return data;
        }
    }
}());

SHRI.modules.lections = (function () {

    var data,
        promise = new $.Deferred();

    $.getJSON('json/lections.json')
    .done(function (a) {
        data = a;
        promise.resolve();
    })
    .fail(function () {
        console.log('Не удалось загрузить данные');
        promise.reject();
    });

    return {
        promise : function () {
            return promise;
        },
        json : function () {
            if (data !== "undefined") return data;
        }
    }
}());

SHRI.modules.lectors = (function () {

    var data,
        promise = new $.Deferred();

    $.getJSON('json/lectors.json')
    .done(function (a) {
        data = a;
        promise.resolve();
    })
    .fail(function () {
        console.log('Не удалось загрузить данные');
        promise.reject();
    });

    return {
        promise : function () {
            return promise;
        },
        json : function () {
            if (data !== "undefined") return data;
        }
    }
}());

SHRI.modules.students = (function () {

    var data,
        promise = new $.Deferred();

    $.getJSON('json/students.json')
    .done(function (a) {
        data = a;
        promise.resolve();
    })
    .fail(function () {
        console.log('Не удалось загрузить данные');
        promise.reject();
    });

    return {
        promise : function () {
            return promise;
        },
        json : function () {
            if (data !== "undefined") return data;
        }
    }
}());

SHRI.vm.getHome = function () {
    location.href = location.origin + location.pathname + '#!/' + SHRI.vm.storage.mainmenu[0].path;
}

SHRI.vm.route = function () {
    var elements = SHRI.modules.util.parsePathReg(location.href),
        id,
        current,
        page_name,
        item,
        mod;

    $('.loading').show();
    if (elements === null) {
        SHRI.vm.getHome();
        return false;
    }

    page_name = elements[1];
    item = elements[2];
    mod = elements[3];

    current = SHRI.modules.util.selectByPath(SHRI.vm.storage.mainmenu, page_name);

    if (!current) {
        SHRI.vm.getHome();
        return false;
    }

    switch (current.type) {
    case "static":
        // статичный контент просто добавляем к дереву
        var render_item = SHRI.modules.util.selectById(SHRI.vm.storage.statical, current.id)
        SHRI.vm.selected({
            name : 'static-template',
            data : render_item
        });
        break;

    case "lections": 
        if (item) {
            SHRI.vm.selected({
                name : 'lection-template',
                data : SHRI.vm.storage.lections[item - 1]
            });
        } else {
            SHRI.vm.selected({
                name : 'lections-template',
                data : SHRI.vm.storage
            });            
        }       
        break;

    case "lectors":
        if (item) {
            SHRI.vm.selected({
                name : 'lector-template',
                data : SHRI.vm.storage.lectors[item - 1]
            });
        } else {
            SHRI.vm.selected({
                name : 'lectors-template',
                data : SHRI.vm.storage
            });            
        }    
        $(window).scrollTop(0);
        break;

    case "students":
        if (item) {
            SHRI.vm.selected({
                name : 'student-template',
                data : SHRI.vm.storage.students[item - 1]
            });
        } else {
            SHRI.vm.selected({
                name : 'students-template',
                data : SHRI.vm.storage
            });            
        }
        $(window).scrollTop(0);

        break;

    default:
    }  

    // если поймали модификатор :p, правим стили и выводим диалог о печати
    if (mod && mod === "p") {
        $('html').addClass('print');
        window.print();
    } else {
        $('html').removeClass('print');
    }

    SHRI.vm.updateState(current.id, page_name, item, mod)
    $('.loading').fadeOut('fast');
} 
/**
 * Слушает изменения в строке адреса и исполняет команды, какие находит в ней
 */
SHRI.vm.updateState = function (id, page_name, item, mod) {
    SHRI.vm.id(id);
    SHRI.vm.page_name(page_name);
    SHRI.vm.item(item);
    SHRI.vm.mod(mod);  
}

SHRI.init = (function () {

    // если необходимые данные доступны, инициализация
    $.when( 
        SHRI.modules.menu.promise(),
        SHRI.modules.statical.promise(),
        SHRI.modules.lectors.promise(),
        SHRI.modules.lections.promise(),
        SHRI.modules.students.promise()
    )
    .done(function () {

        // загружаем данные в хранилище
        SHRI.vm.storage = {            
            mainmenu : SHRI.modules.menu.json(),
            statical : SHRI.modules.statical.json(),
            lectors : SHRI.modules.lectors.json(),
            lections : SHRI.modules.lections.json(),
            students : SHRI.modules.students.json()
        }

        SHRI.vm.id = ko.observable(0);
        SHRI.vm.page_name = ko.observable('');
        SHRI.vm.item = ko.observable('');
        SHRI.vm.mod = ko.observable('');

        SHRI.vm.selected = ko.observable(); 

/*        SHRI.vm.selected.storage = ko.observable('');
        SHRI.vm.selected.storage(SHRI.vm.storage.students);*/

        // инициализация текущего состояния
        SHRI.vm.route();
        $(window).bind('hashchange', SHRI.vm.route);
        ko.applyBindings(SHRI.vm);
    });

}()); 