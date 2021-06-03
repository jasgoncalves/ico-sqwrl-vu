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
import { QueryBody, SQWRLQueryElement } from '../model/query-body';

@Component({
  selector: 'app-sqwrl',
  templateUrl: './sqwrl.component.html',
  styleUrls: ['./sqwrl.component.css']
})
export class SqwrlComponent implements OnInit {

  constructor(private http: HttpClient) { }

      queryArray: Array<QueryTable> = [];  
      newRow: QueryTable = new QueryTable("","", "",false,true); 
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

      ngOnInit(): void {  

      }  

      refreshResult() {
        console.log(this.page)
        this.queryResult = this.resultData
          .map((result: any, i: number) => ({id: i + 1, ...result}))
          .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
        console.log(this.queryResult)
      }

      addRow() { 
        this.newRow.queryElement.args.push(this.variables.pop()) 
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
        this.newRow = new QueryTable("","", "",false,true)  
        console.log(this.queryArray);  
      }  

      deleteRow(index:number) {  
        this.queryArray.splice(index, 1);   
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
            x.queryElement.args)))
        
        const body = JSON.stringify(queryBody)

        console.log(body)

        var response = await this.http
          .post<any>(this.url+'/sqrwl/query', body, {headers: headers})
          .toPromise()
          .catch(error => error);

        this.resultData = response.data.result
        this.collectionSize = response.data.rows;

        this.refreshResult()        
            
        console.log(response); 
        
        this.queryRunning = false

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
