class cssDog {
    constructor() {
        const _ = this;
        _.symbols = [' ','>','<',':',';','~',',',`{`,'}','[',']'];
        _.arrOfStyles = [];
        _.resultStr = {};
        _.resolutions = [];
    }

    // Получает последний символ переменной _.outStr
    prev(str){
        return str[str.length - 1];
    }

    // Сравнение последнего символа _.outStr и следующего символа строки с теми что есть в массиве _.symbols
    comparison(prev,next = null){
        const _ = this;
        prev = _.symbols.indexOf(prev);
        next = _.symbols.indexOf(next);

        return prev >= 0 || next >= 0;
    }

    // Удаляет лишние пробелы и переносы из переданной строки
    stringMinify(str){
        const _ = this;
        let resultStr = '';

        for (let i = 0; i < str.length; i++) {
            let
                next = str[i + 1],
                prev = _.prev(resultStr);

            if (str[i] === '\n' || str[i] === '\t') continue;
            let checkSymbol = _.comparison(next,prev);
            if (str[i] === ' ' && checkSymbol) continue;
            if (str[i] === '}' && prev === ';') resultStr = resultStr.substr(0, resultStr.length - 1);

            resultStr += str[i];
        }
        return resultStr;
    }

    // Разбивает строку на массив подстрок
    stringSmashing(str){
        const _ = this;
        let
            arr = [],
            elementDeepth = 0,
            elementEnd = false,
            subStr = '';

        for (let i = 0; i < str.length; i++){

            subStr += str[i];

            if(str[i] === '{'){
                elementDeepth += 1;
            } else if(str[i] === '}'){
                elementDeepth -= 1;
                if(elementDeepth <= 0){
                    elementEnd = true;
                }
            } else if(str[i] === ';' && elementDeepth <= 0){
                elementEnd = true;
            }

            if(elementEnd === true){
                subStr = subStr.trim();
                arr.push(subStr);
                subStr = '';
                elementEnd = false;
            }
        }
        return arr;
    }

    // Определяет тип подстроки и запускает соответствующие методы
    arrayOfSubstringsSort(arr,resolution = 'outside',parent = null){
        const _ = this;
        let inResolutionCheck = false;
        _.resolutions.forEach(function (res) {
            if(res['name'] === resolution) inResolutionCheck = true;
        });
        if(inResolutionCheck === false) _.resolutions.push({'name' : resolution});

        arr.forEach(function (el) {

            if(el[0] !== '@'){
                _.stringToObject(el,resolution)
            } else {
                if(el.indexOf('@media') >= 0) {
                    let body = '';
                    resolution = parent ? parent + ' ' : '';
                    let i = 0;
                    for (i; i < el.length; i++){
                        if(el[i] === '{'){
                            break
                        }
                        resolution += el[i];
                    }
                    let self = resolution;
                    body = el.substr(i + 1,el.length - (i + 2));
                    body = _.stringSmashing(body);
                    _.arrayOfSubstringsSort(body,resolution,self)
                } else {
                    _.unprocessedStringsCut(el,resolution)
                }
            }
        });
    }

    // Преобразует переданный массив подстрок в объекты
    stringToObject(el,resolution){
        const _ = this;

        let subs = el.split('{');
        subs[1] = subs[1].slice(0,subs[1].indexOf('}'));

        let names = subs[0].split(',');
        let styles = subs[1].split(';');
        names.forEach(function (name) {
            styles.forEach(function (style) {

                let unit = {};

                style = style.split(':');
                unit['name'] = name;
                unit['nameOfStyle'] = style[0];

                _.arrOfStyles.forEach(function (styleObject,index) {
                    if(styleObject['name'] === name && styleObject['nameOfStyle'] === style[0]) {
                        for (let key in styleObject){
                            if(!unit[key]) {
                                unit[key] = styleObject[key];
                            }
                        }
                        _.arrOfStyles.splice(index,1)
                    }
                });

                unit[`${resolution}`] = style[1];
                _.arrOfStyles.push(unit)
            })
        });
    }

    // Вырезает необрабатываемые строки
    unprocessedStringsCut(element,resolution = 'outside'){
        const _ = this;

        if(!_.resultStr[resolution]) _.resultStr[resolution] = '';
        _.resultStr[resolution] += element;
    }

    // Проверяет перезапись одинаковых стилей в разных медиаскринах
    oneStyleOneValueCheck(){
        const _ = this;

        _.arrOfStyles.forEach(function (element) {

        })
    }

    // Формирует объекты media
    createMediaObjects(){
        const _ = this;

        _.resolutions.forEach(function (resolution) {

            resolution.elements = [];

            for (let str in _.resultStr){
                if(str === resolution['name']){
                    resolution['str'] = _.resultStr[str];
                }
            }


            _.arrOfStyles.forEach(function (stylesOfElement) {
                for (let res in stylesOfElement){
                    if(res === resolution['name']){
                        let object = {};
                        object.name = stylesOfElement.name;
                        object.style = stylesOfElement.nameOfStyle;
                        object.styleValue = stylesOfElement[res];
                        resolution.elements.push(object)
                    }
                }
            });
        });
    }


    groupCSS(str,actions = []){
        const _ = this;
        let minifiedStr = '';
        minifiedStr = _.stringMinify(str);


        let arrayOfSubstrings = _.stringSmashing(minifiedStr);
        _.arrayOfSubstringsSort(arrayOfSubstrings);
        _.oneStyleOneValueCheck();

        console.log(_.arrOfStyles);
        console.log(_.resolutions);

        //_.createMediaObjects();
    }
}

let dog = new cssDog();
let str = `
    @import url(https://fonts.googleapis.com/css?family=Montserrat:400,600,800&display=swap);
    .bgc , input[type='checkbox']{
        margin: 0 auto;
    }
    .bgc {
        margin: 55px 55px;
    }
    input[type='checkbox']{
        display: none;
    }
    
    @media screen and (min-width: 1200px) {
    
        .bgc {
            margin : 20px;
        }
        input[type='checkbox']{
            display: block;
        }
        
        @media screen and (max-height: 500px){
            .bgc {
                margin : 0;
            }
        }
        @media screen and (min-height: 300px){
            .bgc {
                margin : 0;
            }
            
            @media screen and (min-height: 350px){
                @import url(https://fonts.googleapis.com/css?family=Montserrat:400,600,800&display=swap);
                .bgc {
                    margin : 50px;
                }
            }
        }
    }
    
    @media screen and (min-width: 768px) {

        .bgc {
            margin: 15px 100px;
        }
        @keyframes dash{to{ stroke-dasharray:10px 8px;}}
    }
    @media screen and (min-width: 768px) {

        .bgc {
            margin: 25px 100px;
        }
    }
`;
dog.groupCSS(str,['']);

/**/