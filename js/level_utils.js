
// Returns a trimmed level ontology for display purposes
export function trimOntology(ontologyStr) {
    let ontologyArray = ontologyStr.split(".");
    return ontologyArray.slice(1).filter(i => i > 0).join(".")
}
