export class QueryElement {

    entityType: string;
    entity: string;
    name: string;
    isOrderedBy: boolean;
    isShowedInResult: boolean; 
    args: any[] = []   
    
    constructor(entityType: string, entity: string, name: string, isOrderedBy: boolean, isShowedInResult: boolean)
    {
        this.entityType = entityType;
        this.entity = entity;
        this.name = name;
        this.isOrderedBy = isOrderedBy;
        this.isShowedInResult = isShowedInResult;
    }

}