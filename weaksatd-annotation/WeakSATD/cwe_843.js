//https://cwe.mitre.org/data/definitions/843.html

import {getPotentialMitigations} from "./findIssue.js";
import {findVariableDeclarations} from "./cwe_467.js";
import dataTypes from "./cwe_467_listOfDataTypes.js";
import {findErrorsSignAndUnsignedConversionError} from "./cwe_195.js";
import isComment from "./isComment.js";
import {findFunctions} from "./cwe_676.js";

let issueNumber = 843

const cwe_843 = (data, comment) => {
    let errorsFound = findErrorsSignAndUnsignedConversionError(data, comment, findVariableDeclarations(data, dataTypes, {start: -1, end: -1}))
    errorsFound = removeunsigned(errorsFound)

    let group = [['char'], ['short', 'int', 'double', 'float, void']]
    let lineNumbers = []
    for(let i = 0 ; i < errorsFound.length; ++i){
        let dest = errorsFound[i].dest
        let source = errorsFound[i].source
        let destIndex
        let sourceIndex
        for(let j = 0 ; j < group.length; ++j){
            if(group[j].includes(dest)){
                destIndex = j
            }
        }

        for(let j = 0 ; j < group.length; ++j){
            if(Array.isArray(source)){
                if (group[j].includes(source[0])){
                    sourceIndex = j
                }
            }else {
                if (group[j].includes(source)) {
                    sourceIndex = j
                }
            }
        }
        if(destIndex !== sourceIndex){
            lineNumbers.push(errorsFound[i].lineNumber)
        }
    }

    //extension
    const vars = findVariableDeclarations(data, dataTypes, {start: -1, end: -1}).filter(single =>
        (single.varName && single.varName.match(/[a-zA-Z]/))
        &&
        !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments)
        &&
        !single.varName.includes('(')
        &&
        !single.varName.includes('}')
        &&
        !single.varName.includes(')')
        &&
        !single.varName.includes('{')
    )

    for(let indexLine = 0 ; indexLine < data.length ; indexLine++){
        const line = data[indexLine]

        for(let indexVars = 0 ; indexVars < vars.length ; indexVars++){
            const variable = vars[indexVars]

            try {
                let regex = new RegExp(`\\(.*\\)${variable.variable}`)
                const result = line.replace(/\s/g, "").match(regex)
                if(result && !lineNumbers.includes(indexLine+1)) {
                    lineNumbers.push(indexLine+1)
                }
            } catch (e){
            }

        }


    }


    const errors_2 = findFunctions(data, ["printIntLine", "printFloatLine"])
        .filter(single => !isComment(single.lineNumber, comment.comments.lineComments, comment.comments.blockComments))


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following lines a type confusion was detected: ${lineNumbers.map(single => `in line ${single}`).join(', ')}`,
        "lineNumbers": [...lineNumbers, errors_2.map(single => single.lineNumber)].flat(),
        "issueNumber": issueNumber
    }

    return errors
}

export const removeunsigned = (errorsFound) =>{
    for(let i = 0 ; i < errorsFound.length; ++i){
        errorsFound[i].dest = errorsFound[i].dest.replace('unsigned ', '')
        if(Array.isArray(errorsFound[i].source)){
            errorsFound[i].source = errorsFound[i].source.filter(single => !single.includes('unsigned'))
        } else {
            errorsFound[i].source = errorsFound[i].source.replace('unsigned ', '')
        }
    }
    return errorsFound
}

export default cwe_843