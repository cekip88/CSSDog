class cssDog {
    constructor() {
        const _ = this;
        _.function = 'group';
    }

    stringSmashing(str){
        const _ = this;
        let
            arr = [],
            elementDeepth = 0,
            elementEnd = false,
            subStr = '';

        for (let i = 0; i < str.length; i++){
            let
                next = str[i + 1],
                prev = subStr[subStr.length - 1];

            if(str[i] === '\n' || str[i] === '\t') continue;
            if(str[i] === ' ' && (
                next === ' ' ||
                next === '>' ||
                prev === '>' ||
                next === ':' ||
                prev === ':' ||
                next === ';' ||
                prev === ';' ||
                next === '~' ||
                prev === '~' ||
                prev === ',' ||
                next === ',' ||
                next === '{' ||
                prev === '{' ||
                next === '}' ||
                prev === '}'
            )) continue;

            if(str[i] === '}' && prev === ';') subStr = subStr.substr(0,subStr.length - 1)

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
                arr.push(subStr)
                subStr = '';
                elementEnd = false;
            }

        }
        console.log(arr);
        return arr;
    }



    groupCSS(str,func){
        const _ = this;
        _.function = func;
        let arrayOfObjects = _.stringSmashing(str)

        if(_.function === 'minify'){
            let resultString = '';
            arrayOfObjects.forEach(function (el) {
                resultString += el;
            })
            return resultString
        }

        return str
    }
}

let dog = new cssDog();
let str = `
    @import url(https://fonts.googleapis.com/css?family=Montserrat:400,600,800&display=swap);
    .bgc {
        display: block;
        margin: -491px auto;
        position:   relative;
        z-index: -1; 
    }
    @-webkit-keyframes dash{to{ stroke-dasharray:10px 8px;}}
    @keyframes dash{to{ stroke-dasharray:10px 8px;}}
    @media screen and (min-width: 768px) {
        section {
            width: 748px;
            margin: 0 auto;
            padding: 0; 
        }
        @keyframes dash{to{ stroke-dasharray:10px 8px;}} 
    }
`
console.log(dog.groupCSS(str,'minify'))