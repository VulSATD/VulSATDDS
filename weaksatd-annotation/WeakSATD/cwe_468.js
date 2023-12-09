//https://cwe.mitre.org/data/definitions/468.html

import {getPotentialMitigations} from "./findIssue.js";
import {findVariableDeclarations} from "./cwe_467.js";
import dataTypes from './cwe_467_listOfDataTypes.js'
import isComment from "./isComment.js";
import {findFunctions} from "./cwe_676.js";

let issueNumber = 468

const cwe_468 = (data, comments) => {
    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": '',
        "lineNumbers": [],
        "issueNumber": issueNumber
    }

    let variables = findVariableDeclarations(data, dataTypes, {start: 0, end: data.length -1} )
    let regexForPointerSpace = /\s*\(\s*.*\s*\*\)\(.*\s*\+\s*.*\)/g
    for(let i = 0; i < variables.length;++i){
        let line = data[variables[i].lineNumber - 1]
        let assignedValue = line.split("=")[1]
        if(assignedValue && doesNotContain(assignedValue , ['malloc'])){
            if(assignedValue.match(regexForPointerSpace) && !isComment(variables[i].lineNumbers, comments.comments.lineComments, comments.comments.blockComments)){
                errors.lineNumbers.push(variables[i].lineNumber)
            }
        }
    }

    errors.text = `In the following lines an error occurred: ${errors.lineNumbers.map(single => `in line ${single} the pointer was addressed wrongly`).join()}`

    let errorsFound = findFunctions(data, ['sizeof'])
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))
        .map(error => error.lineNumber)

    errors.lineNumbers = [errors.lineNumbers, errorsFound, findErrors(data)].flat()

    return errors
}

const doesNotContain = (assignedValue, functionList) =>{
    return functionList.filter(single => assignedValue.includes(single)).length === 0
}

const findErrors = (data) => {
    let result = []
    for(let index = 0 ; index < data.length; ++index){
        let line = data[index]
        let regex =  /=.*\*.*(\+\d)/g
        let match = regex.exec(line)

        if(match !== null) {
            result.push(index+1)
        }
    }
    return result
}

export default cwe_468