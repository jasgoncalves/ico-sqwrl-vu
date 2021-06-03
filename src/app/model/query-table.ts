export class QueryTable {

    entityType: string;
    entity: string;
    isOrderedBy: boolean;
    isShowedInResult: boolean;    
    
    constructor(entityType: string, entity: string, isOrderedBy: boolean, isShowedInResult: boolean)
    {
        this.entityType = entityType;
        this.entity = entity;
        this.isOrderedBy = isOrderedBy;
        this.isShowedInResult = isShowedInResult;
    }

}