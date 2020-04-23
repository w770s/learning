import { Component, OnInit } from '@angular/core';


import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


const getNavGql = gql`
  {
    navList{
      title,
      status
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  public navList:any=[];

  constructor(public apollo:Apollo) { }

  ngOnInit() {


    this.apollo
      .watchQuery({
        query: getNavGql
      })
      .valueChanges.subscribe((response:any)=>{

          console.log(response);

          this.navList=response.data.navList;
      })


  }

}
