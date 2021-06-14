export class Order {

    id: string;
    dataType: string;
    value: string;
    canBeEdited: boolean;

    constructor(id: string, dataType: string, value: string, canBeEdited: boolean){
        this.id = id
        this.dataType = dataType
        this.value = value
        this.canBeEdited = canBeEdited
    }
}