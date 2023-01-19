import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { __values } from 'tslib';

@Component({
  selector: 'app-tableexample',
  templateUrl: './tableexample.component.html',
  styleUrls: ['./tableexample.component.css']
})
export class TableexampleComponent implements OnInit {

  athletes: any;
  scoreSystem: any;

  sortedAtlhetes: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('./assets/data/sistema_pontuacao.json').subscribe(data => {
      this.scoreSystem = data;
    });

    this.http.get('./assets/data/resultados.json').subscribe(data => {
      this.athletes = data;
      this.athletes.forEach((element : any) => {
        element.score = 0;
        element.results.forEach((value :any) => {     
          const typeOfDecatlhon = this.scoreSystem.find((i: any ) => i.event == value.type)      
          if(typeOfDecatlhon.type == 'track'){
            if(value.type == '1500 m'){
              let [minutes, seconds] = value.result.split(":");
              value.result = (parseInt(minutes) * 60) + parseFloat(seconds);
            }
            element.score = element.score + (typeOfDecatlhon.A * Math.pow(typeOfDecatlhon.B - value.result, typeOfDecatlhon.C)).toFixed(2);
          } else if (typeOfDecatlhon.type == 'field'){
            element.score = element.score + (typeOfDecatlhon.A * Math.pow(value.result - typeOfDecatlhon.B, typeOfDecatlhon.C)).toFixed(2);
          } else {
            return;
          }
        })
        element.score = parseFloat(element.score);
      });
      let counter: number = 1;
      let lastScore: number = 0;
      this.athletes = this.athletes.sort((a: any, b: any) => {
        return b.score - a.score;
      }).map((item: any, index: any) => {
        if (index === 0) {
          lastScore = item.score;
          return {...item, position: counter};
        } else if (item.score === lastScore) {
          return {...item, position: counter + '-' + (counter + 1)};
        } else {
          lastScore = item.score;
          counter = counter + 1;
          return {...item, position: counter};
        }
      });
    });
  }
}
