//https://cwe.mitre.org/data/definitions/188.html

import {getPotentialMitigations} from "./findIssue.js";
import isComment from "./isComment.js";

let issueNumber = 188

const cwe_188 = (data, comments) => {

    let errorsFound = [findErrors(data, comments), findErrorsSARD_1(data, comments), findErrorsSARD_2(data, comments), findErrorsSARD_3(data,comments)].flat()

    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a violation on reliance on data/memory layout was detected: ${errorsFound.map(single => `on line ${single}`).join(', ')}`,
        "lineNumbers": errorsFound,
        "issueNumber": issueNumber
    }

    return errors
}

const findErrors = (data, comment) => {
    let result = [] //numbers
    let regex = new RegExp('\\*\\(&[a-zA-Z0-9]*\\s*[+|-]\\s[a-zA-Z0-9]*\\s*\\)\\s*=\\s*[a-zA-Z0-9]*;an', 'g')
    for(let line in data){
        if(!isComment(line, comment.comments.lineComments, comment.comments.blockComments)){
            let match = regex.exec(data[line])
            if ( match ) {
                result.push(line + 1)
            }
        }
    }
    return result
}

const findErrorsSARD_1 = (data, comment) => {
    let result = [] //numbers
    const regex = /\|\=/g;
    for(let line in data){
        if(!isComment(line, comment.comments.lineComments, comment.comments.blockComments)){
            let match = data[line].match(regex)
            if ( match ) {
                result.push(parseInt(line) + 1)
            }
        }
    }

    return result
}

const findErrorsSARD_2 = (data, comment) => {
    let result = [] //numbers
    const regex = /\*\(\s*.*\*\s*\)\(\s*.*\s*\+\s*sizeof\(\s*.*\s*\)\)\s*\=/g;
    for(let line in data){
        if(!isComment(line, comment.comments.lineComments, comment.comments.blockComments)){
            let match = data[line].match(regex)
            if ( match ) {
                result.push(parseInt(line) + 1)
            }
        }
    }

    return result
}

const findErrorsSARD_3 = (data, comment) => {
    let result = [] //numbers
    const regex = /sizeof\(.*\)\/sizeof\(.*\)/g;
    for(let line in data){
        if(!isComment(line, comment.comments.lineComments, comment.comments.blockComments)){
            let match = data[line].match(regex)
            if ( match ) {
                result.push(parseInt(line) + 1)
            }
        }
    }

    return result
}

export default cwe_188