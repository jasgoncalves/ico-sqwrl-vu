import { Component, OnInit } from '@angular/core';
import { QueryTable } from '../model/query-table'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Clazz } from '../model/clazz';
import { DataPropety } from '../model/data-property';
import { ObjectPropety } from '../model/object-property';
import { RelationalOperator } from '../model/relational-operator';
import { Individual } from '../model/individual';
import { ClazzResponse } from '../model/clazz-response';
import { EntityType } from '../model/entity-type';
import { QueryBody, SQWRLQueryElement, QueryResponse } from '../model/query-body';

@Component({
  selector: 'app-sqwrl',
  templateUrl: './sqwrl.component.html',
  styleUrls: ['./sqwrl.component.css']
})
export class SqwrlComponent implements OnInit {

  constructor(private http: HttpClient) { }

  queryArray: Array<QueryTable> = [];  
  newRow: QueryTable = new QueryTable("","", "",false,true,true); 
  entityType: EntityType[] = []
  clazzes: Clazz[] = [];
  objectProperties: ObjectPropety[] = [];
  dataProperties: DataPropety[] = [];
  individuals: Individual[] = [];
  relationalOperators: RelationalOperator[] = [];
  url : string = 'http://localhost:8080/semantic/api/v1'
  loading : boolean = false
  queryRunning : boolean = false
  currentArg: any;
  variables: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  columns: string[] = []
  queryResult: any[] = []
  page = 1;
  pageSize = 10;
  collectionSize: number = 0;
  resultData: any[] =[]
  queriesList: QueryResponse[] =[]
  currentQuery: QueryResponse = new QueryResponse()
  newQuery: QueryResponse = new QueryResponse()
  editMode: boolean = false
  editNewMode: boolean = false
  alertMessage: string = ""
  alertType: string = ""
  showLiteralTextBox: boolean = false

  ngOnInit(): void {  

    this.getQueries()

  }  

  async getQueries() {

    var response = await this.http.get<any>(this.url+'/sqrwl/query')
    .toPromise()
      .catch(error => {
        console.log(error);
        this.showAlert('danger', error.error.description)
        return
      });
    this.queriesList = response.data;

  }

  // Button actions

  createQuery() {

    this.editNewMode = true
    this.newQuery = new QueryResponse()
    this.newQuery.name = ""
    this.queryArray = []

  }

  cancelEdit() {

    var queryParameters = this.queriesList.filter(x=> x.id === this.currentQuery.id)[0].query_parameters
    var newQueryArray: Array<QueryTable> = []; 
    queryParameters.forEach(element => {
      var t = new QueryTable(element.entityType, element.name, element.entity, element.orderedBy, element.columnShowed, false);
      t.queryElement.args = element.args
      t.queryElement.name = element.name
      t.queryElement.entity = element.entity
      t.queryElement.entityType = element.entityType
      t.queryElement.isOrderedBy = element.orderedBy
      t.queryElement.isShowedInResult = element.columnShowed
      t.entity = t.entity==='Literal' ? element.args[0] : t.entity
      newQueryArray.push(t)         
    });

    this.queryArray = newQueryArray

    this.editNewMode = false
    this.editMode = false

  }

  editQuery() {

    this.editMode = true

  }

  showAlert(type: string, message: string){
    this.alertMessage = message
    this.alertType = type
  }

  closeAlert(){
    this.alertMessage = ""
    this.alertType = ""
  }

  async deleteQuery() {

    const headers = new HttpHeaders()
    .append(
      'Content-Type',
      'application/json'
    );

    await this.http
      .delete<any>(this.url+'/sqrwl/query/'+this.currentQuery.id, {headers: headers})
      .toPromise()
      .catch(response => {
        console.log(response);
        this.showAlert('danger', response.error.error.description)}
        );

    this.getQueries()

    this.showAlert('success', 'Query was deleted!')

    this.currentQuery = new QueryResponse()
    this.currentQuery.name = ""
    this.queryArray = [];
    this.refreshResult() 
    this.editNewMode = false
    this.editMode = false

  }

  prepareBodyData(name: string){

    var queryBody = new QueryBody();

    queryBody.name = name

    console.log(this.queryArray)

    this.queryArray.forEach(x=> queryBody.query_parameters.push(
      new SQWRLQueryElement(
        x.queryElement.entityType, 
        x.queryElement.entity, 
        x.queryElement.name, 
        x.queryElement.isOrderedBy,
        x.queryElement.isShowedInResult, 
        x.queryElement.args)))

    console.log(queryBody)
    
    return JSON.stringify(queryBody)

  }

  prepareHeaders(){
    return new HttpHeaders()
    .append(
      'Content-Type',
      'application/json'
    );
  }

  prepareQuery(){
    this.queryRunning = true
    this.columns = []
    this.queryArray.filter(x=>x.isShowedInResult===true).forEach(element=> this.columns.push(element.queryElement.name))
    this.queryResult = []
    
  }

  async updateQuery() {

    if(this.currentQuery.name === "" || this.queryArray.length === 0){
      this.showAlert('warning', "You must fill in the query name and query parameters")
      return
    }

    this.prepareQuery()

    const headers = this.prepareHeaders()

    const body = this.prepareBodyData(this.currentQuery.name)

    console.log(body)

    var response = await this.http
      .put<any>(this.url+'/sqrwl/query/'+this.currentQuery.id, body, {headers: headers})
      .toPromise()
      .catch(response => {
        console.log(response);
        this.showAlert('danger', "Query was updated with errors:" + response.error.error.description)
        this.queryRunning = false}
        );

    this.resultData = response.data.result
    this.collectionSize = response.data.rows;

    this.refreshResult()    
    this.getQueries()        
    console.log(response); 
    
    this.showAlert('success', 'Query was updated!')

    this.queryRunning = false

    this.editMode = false

  }

  async runQuery(){

    this.prepareQuery()

    const headers = this.prepareHeaders()

    const body = this.prepareBodyData(this.currentQuery.name)

    console.log(body)

    var response = await this.http
      .post<any>(this.url+'/sqrwl/query/run', body, {headers: headers})
      .toPromise()
      .catch(response => {
        console.log(response);
        this.showAlert('danger', response.error.error.description)
        this.queryRunning = false}
        );

    this.resultData = response.data.result
    this.collectionSize = response.data.rows;

    this.refreshResult()        
        
    console.log(response); 

    this.showAlert('success', "Rows:" + response.data.rows)
    
    this.queryRunning = false

  }

  async saveQuery(){

    if(this.newQuery.name === "" || this.queryArray.length === 0){
      this.showAlert('warning', "You must fill in the query name and query parameters")
      return
    }

    this.prepareQuery()

    const headers = this.prepareHeaders()

    const body = this.prepareBodyData(this.newQuery.name)

    console.log(body)

    var response = await this.http
      .post<any>(this.url+'/sqrwl/query', body, {headers: headers})
      .toPromise()
      .catch(response => {
        console.log(response);
        this.showAlert('danger', response.error.error.description)
        this.queryRunning = false}
        );

    this.newQuery.id = response.data
    this.currentQuery = this.newQuery

    this.getQueries()

    this.refreshResult()
        
    console.log(response); 

    this.showAlert('success', 'Query was saved!')
    
    this.queryRunning = false
    this.editNewMode = false

  }

  refreshResult() {
    console.log(this.page)
    this.queryResult = this.resultData
      .map((result: any, i: number) => ({id: i + 1, ...result}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    console.log(this.queryResult)
  }

  addRow() { 
    if(this.newRow.entity === "" || this.newRow.entityType === ""){
      this.showAlert('warning', "You must select the Entity type and Entity")
      return
    }
    if(!this.editNewMode && this.currentQuery.id != "") this.editMode = true
    if(!this.editMode && !this.editNewMode && this.currentQuery.id === "") this.editNewMode = true
    this.queryArray.forEach(x=>
      x.queryElement.args.forEach(y=>         
        this.variables.forEach((element, index) => {if(element === y) this.variables.splice(index,1)}
          )
        )
      )
    this.newRow.canBeEdited = false
    this.newRow.queryElement.isOrderedBy = this.newRow.isOrderedBy
    this.newRow.queryElement.isShowedInResult = this.newRow.isShowedInResult
    if (this.queryArray.length > 0) {
      switch(this.newRow.entityType) { 
        case "Class": { 
          this.newRow.queryElement.args.push(this.variables.pop()) 
          
          break; 
        } 
        case "ObjectProperty": { 
          this.newRow.queryElement.args.push(this.variables.pop()) 
          this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1])
          break; 
        } 
        case "DatatypeProperty": { 
          this.newRow.queryElement.args.push(this.variables.pop()) 
          this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1])
          this.newRow.queryElement.args.reverse()
          break; 
        } 
        case "Individual": { 
          if(this.queryArray[this.queryArray.length - 1].queryElement.args.length > 1)
            this.queryArray[this.queryArray.length - 1].queryElement.args.pop()
          this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1])
          break; 
        } 
        case "RelationalOperator": { 
          this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1])
          this.newRow.isShowedInResult = false
          break; 
        } 
        case "Literal": { 

          var arg = this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1]
          this.newRow.id = this.queryArray.filter(x=> x.entityType === "DatatypeProperty" && x.queryElement.args[1] == arg )[0].id

          if(this.queryArray[this.queryArray.length - 1].queryElement.args.length > 1 && this.queryArray[this.queryArray.length - 1].queryElement.entityType != 'RelationalOperator')
          {
            this.queryArray[this.queryArray.length - 1].queryElement.args.splice(1,1)
          }

          this.newRow.queryElement.args.push(this.newRow.entity)
          var queryElement = this.newRow.queryElement;
          queryElement.entityType = this.newRow.entityType;
          queryElement.entity = this.newRow.id;
          queryElement.name = this.newRow.entityType
          queryElement.isOrderedBy = false;
          queryElement.isShowedInResult = false;
          this.newRow.isShowedInResult = false
          break; 
        } 
      }
    } else {

      switch(this.newRow.entityType) { 
        case "Class": { 
          this.newRow.queryElement.args.push(this.variables.pop()) 
          break; 
        } 
        case "ObjectProperty": { 
          this.newRow.queryElement.args.push(this.variables.pop()) 
          break; 
        } 
        case "DatatypeProperty": { 
          this.newRow.queryElement.args.push(this.variables.pop()) 
          break; 
        } 
        case "Individual": { 
          this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1])
          break; 
        } 
        case "RelationalOperator": { 
          this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[this.queryArray[this.queryArray.length - 1].queryElement.args.length -1])
          this.newRow.isShowedInResult = false
          break; 
        } 
        case "Literal": { 
          this.newRow.queryElement.args.push(this.newRow.entity)
          this.newRow.isShowedInResult = false
          break; 
        } 
      }
    }  
    this.queryArray.push(this.newRow); 
    this.newRow = new QueryTable("","", "",false,true,true)  
    console.log(this.queryArray);  
  }  

  deleteRow(index:number) {  
    this.queryArray.splice(index, 1);
    this.showLiteralTextBox = false   
  }

  edit(index:number) {  
    if(!this.editNewMode && this.currentQuery.id != "") this.editMode = true
    if(!this.editMode && !this.editNewMode && this.currentQuery.id === "") this.editNewMode = true
    this.newRow.canBeEdited = false;
    this.onEntityTypeChange(this.queryArray[index].entityType)
    this.queryArray[index].canBeEdited = true;     
  }

  editEnd(index:number) {  
    this.queryArray[index].canBeEdited = false; 
    this.queryArray[index].queryElement.isOrderedBy = this.queryArray[index].isOrderedBy; 
    this.queryArray[index].queryElement.isShowedInResult = this.queryArray[index].isShowedInResult; 
    this.newRow.canBeEdited = true; 
    console.log(this.queryArray)  
  }

  onQueryListChange(entityType : string){
    console.log(entityType);
    this.currentQuery.id = entityType === '0' ? "" : entityType
    this.currentQuery.name = this.queriesList.filter(x=> x.id === entityType)[0].name
    var queryParameters = this.queriesList.filter(x=> x.id === entityType)[0].query_parameters
    var newQueryArray: Array<QueryTable> = []; 
    queryParameters.forEach(element => {
      var t = new QueryTable(element.entityType, element.name, element.entity, element.orderedBy, element.columnShowed, false);
      t.queryElement.args = element.args
      t.queryElement.name = element.name
      t.queryElement.entity = element.entity
      t.queryElement.entityType = element.entityType
      t.queryElement.isOrderedBy = element.orderedBy
      t.queryElement.isShowedInResult = element.columnShowed
      t.entity = t.entity==='Literal' ? element.args[0] : element.name
      newQueryArray.push(t)         
    });

    this.queryArray = newQueryArray
    
  }


  async onEntityTypeChange(entityType : string){
    console.log(entityType);
    this.loading = true;
    switch(entityType) { 
      case "Class": { 
        this.showLiteralTextBox = false
        var response = await this.http.get<ClazzResponse>(this.url+'/classes').toPromise();
        this.entityType = response.data;
        break; 
      } 
      case "ObjectProperty": { 
        this.showLiteralTextBox = false
        var response = await this.http.get<ClazzResponse>(this.url+'/object-properties').toPromise();
        this.entityType = response.data;
        break; 
      } 
      case "DatatypeProperty": { 
        this.showLiteralTextBox = false
        var response = await this.http.get<ClazzResponse>(this.url+'/datatype-properties').toPromise();
        this.entityType = response.data;
        break; 
      } 
      case "Individual": { 
        this.showLiteralTextBox = false
        var response = await this.http.get<ClazzResponse>(this.url+'/individuals').toPromise();
        this.entityType = response.data;
        break; 
      } 
      case "RelationalOperator": { 
        this.showLiteralTextBox = false
        var response = await this.http.get<ClazzResponse>(this.url+'/relational-operators').toPromise();
        this.entityType = response.data;
        break; 
      } 
      case "Literal": { 
        this.showLiteralTextBox = true
        break; 
      } 
      default: { 
        this.entityType = []
        break; 
      } 
    }
    this.loading = false; 
  }

  async onEntityChange(index: number, event: any){
    console.log(event.target.id);
    var row = this.queryArray[index];
    row.entity = this.entityType.filter(x=> x.id === row.id)[0].label;
    switch(row.entityType) { 
      case "Class": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break; 
      } 
      case "ObjectProperty": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity;
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break;
      } 
      case "DatatypeProperty": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity;
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break;
      } 
      case "Individual": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break; 
      } 
      case "RelationalOperator": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = false;
        queryElement.isShowedInResult = false;
        break;
      } 
      default: { 
        break; 
      } 
    }
  }

  async onNewRowEntityChange(event: any){
    console.log(event.target.attributes.id);
    var row = this.newRow;
    row.entity = this.entityType.filter(x=> x.id === row.id)[0].label;
    switch(row.entityType) { 
      case "Class": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break; 
      } 
      case "ObjectProperty": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity;
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break;
      } 
      case "DatatypeProperty": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity;
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break;
      } 
      case "Individual": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break; 
      } 
      case "RelationalOperator": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break;
      } 
      case "Literal": { 
        var queryElement = row.queryElement;
        queryElement.entityType = row.entityType;
        queryElement.entity = row.id;
        queryElement.name = row.entity
        queryElement.isOrderedBy = row.isOrderedBy;
        queryElement.isShowedInResult = row.isShowedInResult;
        break;
      } 
      default: { 
        break; 
      } 
    }
  }        
}
