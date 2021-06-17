# Projeto de Inteligencia Computacional e Otimizacao

## Objetivo

Desenvolvimento de uma aplicação para suporte a casos de uso a gestão e utilização do conhecimento com recursos a ontologias OWL,  incluindo utilização do conhecimento no contexto dos projetos como o de VRP (Vehicle Routing Problem) ou Scheduling.

O foco deste projeto está na representação, modelação, manutenção, interrogação, visualização, curadoria, etc., do conhecimento com recursos a normas, ferramentas e APIS como:

Protegé
OWL
SQWRL
VOWL

A API (REST) desenvolvida tem como objetivo principal permitir de forma simples, sem ser necessario conhecer em detalhe a sintaxe SQWRL, efetuar queries a uma ontologia (OWL) previamente carregadas. Tem como outras funcionalidades a possibilidade de guardar em base de dados queries criadas via API e tambem uma funcionlaidade especifica para edicao de um ficheiro OWL, neste projeto foi utilizado para demonstrar a possibilidade de adicionar-mos o nosso problema customizado de scheduling.

## Arquitetura

Para este projeto optei como padrao arquitetural da aplicacao o pardrao _Clean Architecture_ proposto por Robert Martin, com objetivo de promover a implementacao de um sistema reusavel, independente de tecnologia e testavel.

![image](https://user-images.githubusercontent.com/33223967/122293324-cfdf7a80-ceee-11eb-9725-4dceef05967b.png)

Diagrama da aplicacao

![image](https://user-images.githubusercontent.com/33223967/122305839-61ef7f00-ceff-11eb-8a24-39cebc349fbb.png)

## Tecnologias 

Tecnologias utilizadas mais relevantes:

Linguagem: 

  - Kotlin v 1.5.0
  - Java - JDK 11.0.9 (Camada Infrastructura)

- Apache Jena 4.0.0 (https://jena.apache.org/)
- SQWRL API 2.0.8 (https://github.com/protegeproject/swrlapi/wiki/SQWRLQueryAPI)
- Hibernate 5.4.2 (https://hibernate.org/)
- H2 Database Engine 1.4.2 (https://h2database.com/html/main.html)
- Spring Boot - 5.1.6 (https://spring.io/projects/spring-boot) 



# Angula Notes:

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
