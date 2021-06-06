export class QueryBody {

    name:string = ""
    query_parameters: Array<SQWRLQueryElement> = [];   

    constructor(){}

}

export class QueryResponse {

    id:string=""
    name:string = ""
    query_parameters: Array<SQWRLQueryElementResponse> = [];   

    constructor(){}

}

export class SQWRLQueryElementResponse {

    entityType: string = "";
    entity: string = "";
    name: string = "";
    orderedBy: boolean = false;  
    columnShowed: boolean = true;
    args: any[] = [];  
    
    constructor(entityType: string, entity: string, name: string, isOrderedBy: boolean, isColumnShowed: boolean, args: any[]){
        this.entityType = entityType
        this.entity = entity
        this.name = name
        this.orderedBy = isOrderedBy
        this.columnShowed = isColumnShowed
        this.args = args
    }

}

export class SQWRLQueryElement {

    entity_type: string = "";
    entity: string = "";
    name: string = "";
    is_ordered_by: boolean = false;  
    is_column_showed: boolean = true;
    args: any[] = [];  
    
    constructor(entityType: string, entity: string, name: string, isOrderedBy: boolean, isColumnShowed: boolean, args: any[]){
        this.entity_type = entityType
        this.entity = entity
        this.name = name
        this.is_ordered_by = isOrderedBy
        this.is_column_showed = isColumnShowed
        this.args = args
    }

}