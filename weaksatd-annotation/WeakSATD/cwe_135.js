//https://cwe.mitre.org/data/definitions/135.html

import {getPotentialMitigations} from "./findIssue.js";
import {findFunctions} from "./cwe_676.js";
import isComment from "./isComment.js";

let issueNumber = 135

const cwe_135 = (data, comments) => {

    let errorsFound = findFunctions(data, ['strlen', 'wcslen'])
        .filter(single => !isComment(single.lineNumber, comments.comments.lineComments, comments.comments.blockComments))


    let errors = {
        "mitigation": getPotentialMitigations(issueNumber),
        "text": `In the following line the command strlen or wcslen was used: ${errorsFound.map(single => `in line ${single.lineNumber}`).join(", ")}`,
        "lineNumbers": errorsFound.map(single => single.lineNumber),
        "issueNumber": issueNumber
    }

    return errors
}

export default cwe_135