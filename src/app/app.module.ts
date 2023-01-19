import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { TableexampleComponent } from './components/tableexample/tableexample.component';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'tableexample', component: TableexampleComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    TableexampleComponent,
    HomeComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [HttpClient,],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
