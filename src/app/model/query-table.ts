import { QueryElement } from '../model/query-element';

export class QueryTable {

    entityType: string;
    entity: string;
    id: string;
    isOrderedBy: boolean;
    isShowedInResult: boolean; 
    canBeEdited: boolean; 
    queryElement: QueryElement = new QueryElement("Class", "", "", false, false);   
    
    constructor(entityType: string, entity: string, id: string, isOrderedBy: boolean, isShowedInResult: boolean, canBeEdited: boolean)
    {
        this.entityType = entityType;
        this.entity = entity;
        this.id = id;
        this.isOrderedBy = isOrderedBy;
        this.isShowedInResult = isShowedInResult;
        this.canBeEdited = canBeEdited;
    }

}