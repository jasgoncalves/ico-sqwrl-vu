export class QueryBody {

    query_parameters: Array<SQWRLQueryElement> = [];   

    constructor(){}

}

export class SQWRLQueryElement {

    entity_type: string = "";
    entity: string = "";
    name: string = "";
    is_ordered_by: boolean = false;  
    args: any[] = [];  
    
    constructor(entityType: string, entity: string, name: string, isOrderedBy: boolean, args: any[]){
        this.entity_type = entityType
        this.entity = entity
        this.name = name
        this.is_ordered_by = isOrderedBy
        this.args = args
    }

}