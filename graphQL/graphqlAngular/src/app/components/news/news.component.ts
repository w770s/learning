import { Component, OnInit } from '@angular/core';


import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const getarticleListGql = gql`
  query articleList($page:Int!,$pageSize:Int!){
    articleList(page:$page,pageSize:$pageSize){
      title,
      status
    }
  }
`;


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.styl']
})
export class NewsComponent implements OnInit {

  public list:any[]=[];

  constructor(public apollo:Apollo) { }

  ngOnInit() {
  }

  getData(){

    //获取新闻数据

    this.apollo
    .watchQuery({
      query: getarticleListGql,
      variables: {
        page: 1,
        pageSize:8
      },
    })
    .valueChanges.subscribe((response:any)=>{

      console.log(response.data.articleList);
        this.list=response.data.articleList;

    });



  }

}
