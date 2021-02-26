import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NewsComponent } from './components/news/news.component';
import { NavlistComponent } from './components/navlist/navlist.component';


const routes: Routes = [

  {

    path:'home',component:HomeComponent
  },

  {

    path:'news',component:NewsComponent
  },

  {

    path:'navlist',component:NavlistComponent
  },

   //匹配不到路由的时候加载的组件 或者跳转的路由
  {

    path:'**',redirectTo:'home'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
