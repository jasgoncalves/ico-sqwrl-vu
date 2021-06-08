export class Clazz {

    id: string;
    label: string;
    uri: string;
    description: string;   
    dataType: string;
    domainLabel: string;
    
    constructor(id: string, label: string, uri: string, description: string, dataType: string, domainLabel: string)
    {
        this.id = id;
        this.label = label;
        this.uri = uri;
        this.description = description;
        this.dataType = dataType;
        this.domainLabel = domainLabel;
    }

}