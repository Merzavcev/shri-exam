/**
 * Модуль SHRI. Содержит всю логику приложения выпускного альбома
 */
;
// (function () {
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

// модуль, хранящий ViewModel
SHRI.namespace('vm'); 

SHRI.namespace('modules.menu');
SHRI.namespace('modules.static');
SHRI.namespace('modules.lectors');
// SHRI.namespace('modules.lections');
// SHRI.namespace('modules.students');
// SHRI.namespace('modules.storage');

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
            var parse_url = /(?:#!\/)([0-9.A-za-z-]+\/)(?:(\d+))?:?(?:([0-9.A-za-z-]+)?)$/,
                result = parse_url.exec(href);
            return result;
        }
    }
}()); 

SHRI.modules.menu = (function () {

    var data,
        promise = new $.Deferred();

    $.getJSON('json/static')
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

    $.getJSON('json/lectors')
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

    $.getJSON('json/students')
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


/**
 * Слушает изменения в строке адреса и исполняет команды, какие находит в ней
 */
SHRI.vm.update = function () {
    var path = SHRI.modules.util.parsePathReg(location.href),
        mainmenu = SHRI.modules.menu.json(),
        current = {},
        page_name,
        item,
        mod;
    
    // в адресной строке наших параметров нет, показываем корень
    if (path === null) {
        current = SHRI.modules.util.selectById(mainmenu, 1);
    } else {
        page_name = path[1],
        item = path[2],
        mod = path[3];            

        if (mod && mod === "p") {
            console.log('Активирован режим для печати');
        }
        // debug
        console.log('page_name: ' + page_name);
        console.log('item: ' + item);
        console.log('mod: ' + mod);

        if (page_name) {
            current = SHRI.modules.util.selectByPath(mainmenu, page_name);
        } else {
            current = SHRI.modules.util.selectById(mainmenu, 1);
        }
    }

    // SHRI.current.state = current;
    SHRI.vm.id(current.id);
}


SHRI.init = (function () {

    // если необходимые данные доступны, инициализация
    $.when( 
        SHRI.modules.menu.promise(),
        SHRI.modules.lectors.promise(),
        SHRI.modules.students.promise()
    )
    .done(function () {

        SHRI.vm.storage = {            
            mainmenu : SHRI.modules.menu.json(),
            lectors : SHRI.modules.lectors.json(),
            students : SHRI.modules.students.json()
        }
        SHRI.vm.id = ko.observable(0);
        // инициализация текущего состояния
        SHRI.vm.update();
        $(window).bind('hashchange', SHRI.vm.update);
        ko.applyBindings(SHRI.vm);
        //vm = new ViewModel();
    });

}()); 