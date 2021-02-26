import { Component, OnInit } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const addNavGql = gql`
  mutation($title: String!,$url: String!) {
    addNav(title:$title,url:,$url){
        title      
    }
  }
`;

const editNavGql = gql`
  mutation($_id: String!,$title: String!,$url: String!) {
    editNav(_id:$_id,title:$title,url:,$url){
        title      
    }
  }
`;


const deleteNavGql = gql`
  mutation($_id: String!) {
    deleteNav(_id:$_id){
        title      
    }
  }
`;





@Component({
  selector: 'app-navlist',
  templateUrl: './navlist.component.html',
  styleUrls: ['./navlist.component.styl']
})
export class NavlistComponent implements OnInit {

  public title:any='';
  public url:any='';

  constructor(public apollo:Apollo) { }

  ngOnInit() {
  }
  doAddNav(){

    this.apollo.mutate({
      mutation: addNavGql,
      variables: {
        title: this.title,
        url:this.url
      }
    }).subscribe(({ data }) => {
      
      console.log('got data', data);

    },(error) => {
      console.log('there was an error sending the query', error);
    });


  }
  doEditNav(){
    this.apollo.mutate({
      mutation: editNavGql,
      variables: {
        _id:'5c9d9e7ae725bc037cefd611',
        title: 'nodejs教程',
        url:'www.itying.com'
      }
    }).subscribe(({ data }) => {
      
      console.log('got data', data);

    },(error) => {
      console.log('there was an error sending the query', error);
    });



  }

  doDeleteNav(){
    this.apollo.mutate({
      mutation: deleteNavGql,
      variables: {
        _id:'5c9d9f62e725bc037cefd612'      
      }
    }).subscribe(({ data }) => {
      
      console.log(data);

    },(error) => {
      console.log('there was an error sending the query', error);
    });


  }
}
