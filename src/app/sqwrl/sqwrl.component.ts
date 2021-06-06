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

      ngOnInit(): void {  

        this.getQueries()
        this.currentQuery.name = ""

      }  

      async getQueries() {

        var response = await this.http.get<any>(this.url+'/sqrwl/query').toPromise();
          this.queriesList = response.data;

      }

    createQuery() {

      this.editNewMode = true
      this.newQuery = new QueryResponse()
      this.newQuery.name = ""

    }

    cancelEdit() {

      this.editNewMode = false
      this.editMode = false

    }

    editQuery() {

      this.editMode = true

    }

    async deleteQuery() {

      const headers = new HttpHeaders()
      .append(
        'Content-Type',
        'application/json'
      );

      var response = await this.http
        .delete<any>(this.url+'/sqrwl/query/'+this.currentQuery.id, {headers: headers})
        .toPromise()
        .catch(error => error);

      this.getQueries()
          
      console.log(response); 

      this.currentQuery = new QueryResponse()
      this.currentQuery.name = ""
      this.queryArray = [];

      this.editNewMode = false
      this.editMode = false

    }

    async updateQuery() {

      if(this.currentQuery.name === "" || this.queryArray.length === 0){
        alert("Deve preencher os campos nome e parametros da query")
        return
      }

      this.queryRunning = true
      this.columns = []

      this.queryArray.forEach(element=> this.columns.push(element.entity))

      const headers = new HttpHeaders()
      .append(
        'Content-Type',
        'application/json'
      );

      var queryBody = new QueryBody();

      queryBody.name = this.currentQuery.name

      this.queryArray.forEach(x=> queryBody.query_parameters.push(
        new SQWRLQueryElement(
          x.queryElement.entityType, 
          x.queryElement.entity, 
          x.queryElement.name, 
          x.queryElement.isOrderedBy,
          x.queryElement.isShowedInResult, 
          x.queryElement.args)))
      
      const body = JSON.stringify(queryBody)

      console.log(body)

      var response = await this.http
        .put<any>(this.url+'/sqrwl/query/'+this.currentQuery.id, body, {headers: headers})
        .toPromise()
        .catch(error => error);

      this.resultData = response.data.result
      this.collectionSize = response.data.rows;

      this.refreshResult() 
      
      this.getQueries()
          
      console.log(response); 
      
      this.queryRunning = false

      this.editMode = false

    }

      refreshResult() {
        console.log(this.page)
        this.queryResult = this.resultData
          .map((result: any, i: number) => ({id: i + 1, ...result}))
          .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
        console.log(this.queryResult)
      }

      addRow() { 
        if(!this.editNewMode && this.currentQuery.id != "") this.editMode = true
        if(!this.editMode && !this.editNewMode && this.currentQuery.id === "") this.editNewMode = true
        this.newRow.queryElement.args.push(this.variables.pop()) 
        this.newRow.canBeEdited = false
        if (this.queryArray.length > 0) {
          switch(this.newRow.entityType) { 
            case "Class": { 
              this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[0])
              break; 
            } 
            case "ObjectProperty": { 
              this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[0])
              break; 
            } 
            case "DatatypeProperty": { 
              this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[0])
              this.newRow.queryElement.args.reverse()
              break; 
            } 
            case "Individual": { 
              this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[0])
              break; 
            } 
            case "RelationalOperator": { 
              this.newRow.queryElement.args.push(this.queryArray[this.queryArray.length - 1].queryElement.args[0])
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
        this.newRow.canBeEdited = true;   
      }

      async runQuery(){

        this.queryRunning = true
        this.columns = []

        this.queryArray.forEach(element=> this.columns.push(element.entity))

        const headers = new HttpHeaders()
        .append(
          'Content-Type',
          'application/json'
        );

        var queryBody = new QueryBody();

        this.queryArray.forEach(x=> queryBody.query_parameters.push(
          new SQWRLQueryElement(
            x.queryElement.entityType, 
            x.queryElement.entity, 
            x.queryElement.name, 
            x.queryElement.isOrderedBy,
            x.queryElement.isShowedInResult, 
            x.queryElement.args)))
        
        const body = JSON.stringify(queryBody)

        console.log(body)

        var response = await this.http
          .post<any>(this.url+'/sqrwl/query/run', body, {headers: headers})
          .toPromise()
          .catch(error => error);

        this.resultData = response.data.result
        this.collectionSize = response.data.rows;

        this.refreshResult()        
            
        console.log(response); 
        
        this.queryRunning = false

      }

      async saveQuery(){

        if(this.newQuery.name === "" || this.queryArray.length === 0){
          alert("Deve preencher os campos nome e parametros da query")
          return
        }

        this.queryRunning = true
        this.columns = []

        this.queryArray.forEach(element=> this.columns.push(element.entity))

        const headers = new HttpHeaders()
        .append(
          'Content-Type',
          'application/json'
        );

        var queryBody = new QueryBody();

        queryBody.name = this.newQuery.name

        this.queryArray.forEach(x=> queryBody.query_parameters.push(
          new SQWRLQueryElement(
            x.queryElement.entityType, 
            x.queryElement.entity, 
            x.queryElement.name, 
            x.queryElement.isOrderedBy,
            x.queryElement.isShowedInResult, 
            x.queryElement.args)))
        
        const body = JSON.stringify(queryBody)

        console.log(body)

        var response = await this.http
          .post<any>(this.url+'/sqrwl/query', body, {headers: headers})
          .toPromise()
          .catch(error => error);

        this.resultData = response.data.result
        this.collectionSize = response.data.rows;
        this.currentQuery = this.newQuery

        this.refreshResult() 
        
        this.getQueries()
            
        console.log(response); 
        
        this.queryRunning = false
        this.editNewMode = false

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
          newQueryArray.push(t)         
        });

        this.queryArray = newQueryArray
        
      }


      async onEntityTypeChange(entityType : string){
        console.log(entityType);
        this.loading = true;
        switch(entityType) { 
          case "Class": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/classes').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "ObjectProperty": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/object-properties').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "DatatypeProperty": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/datatype-properties').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "Individual": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/individuals').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "RelationalOperator": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/relational-operators').toPromise();
            this.entityType = response.data;
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
            queryElement.name = row.entity
            queryElement.isOrderedBy = row.isOrderedBy;
            queryElement.isShowedInResult = row.isShowedInResult;
            break;
          } 
          case "DatatypeProperty": { 
            var queryElement = row.queryElement;
            queryElement.entityType = row.entityType;
            queryElement.entity = row.id;
            queryElement.name = row.entity
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
            queryElement.name = row.entity
            queryElement.isOrderedBy = row.isOrderedBy;
            queryElement.isShowedInResult = row.isShowedInResult;
            break;
          } 
          case "DatatypeProperty": { 
            var queryElement = row.queryElement;
            queryElement.entityType = row.entityType;
            queryElement.entity = row.id;
            queryElement.name = row.entity
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
          default: { 
            break; 
          } 
       }
      }
         
}
