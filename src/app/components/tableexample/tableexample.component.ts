import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

interface Athlete {
  athlete: string;
  results: Result[];
  score: number;
  position: string;
}

interface Result {
  type: string;
  result: number | string;
  points: number;
}

interface ScoreSystem {
  event: string;
  type: string;
  A: number;
  B: number;
  C: number;
}


@Component({
  selector: 'app-tableexample',
  templateUrl: './tableexample.component.html',
  styleUrls: ['./tableexample.component.css']
})
export class TableexampleComponent implements OnInit {

  athletes: Athlete[] = [];
  scoreSystem: ScoreSystem[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Athlete[]>('./assets/data/resultados.json').subscribe(data => {
      this.athletes = data;
      this.http.get<ScoreSystem[]>('./assets/data/sistema_pontuacao.json').subscribe(data => {
        this.scoreSystem = data;
        this.athletes.forEach(athlete => {
          athlete.score = 0;
          athlete.results.forEach(result => {
            if (result.type === '1500 m' && typeof result.result === 'string') {
              const time = result.result.split(':');
              const minutes = parseInt(time[0]);
              const secondsAndMiliseconds = time[1].split('.');
              const seconds = parseInt(secondsAndMiliseconds[0]);
              const mil = parseInt(secondsAndMiliseconds[1]);
              result.result = (minutes * 60) + seconds + (mil / 100);
            }
            const decathlonType = this.scoreSystem.find(d => d.event === result.type);
            if(decathlonType){
              if (typeof result.result === 'string') {
                result.result = parseFloat(result.result);
              }
              result.points = this.decathlon(result.result, decathlonType.A, decathlonType.B, decathlonType.C, decathlonType.type);
            } else {
              console.error(`Type ${result.type} not found`);
            }
            athlete.score += result.points;
          });

          this.athletes = this.athletes.sort((a, b) => b.score - a.score);
          for (let i = 0; i < this.athletes.length; i++) {
            this.athletes[i].position = (i + 1).toString(); //set initial position
            //check if there are other athletes with the same score
            const sameScoreAthlete = this.athletes.find(a => a.score === this.athletes[i].score && a !== this.athletes[i]);
            if (sameScoreAthlete) {
                //set the position as a string for both athletes
                this.athletes[i].position = `${this.athletes.indexOf(sameScoreAthlete) + 1}-${i + 1}`;
                sameScoreAthlete.position = `${this.athletes.indexOf(sameScoreAthlete) + 1}-${i + 1}`;
            }
          }
        });
      });
    });
  }

  decathlon(result: number, A: number, B: number, C: number, eventType: string): number {
    const roundedC = Math.round(C);
    if (eventType === 'track') {
      return Math.floor(A * Math.pow(B - result, roundedC));
    } else {
      return Math.floor(A * Math.pow(result - B, roundedC));
    }
  }

  exportToCSV() {
    const headers = ['Athlete', '100 m', 'Long jump', 'Shot put', 'High jump', '400 m', '100 m hurdles', 'Discus throw', 'Pole vault', 'Javelin throw', '1500 m', 'Score', 'Position'];
    const data = [headers];
    this.athletes.forEach(athlete => {
      const athleteData = [athlete.athlete];
      athlete.results.forEach(result => {
          athleteData.push(result.result.toString());
      });
      athleteData.push(athlete.score.toString(), athlete.position.toString());
      data.push(athleteData);
    });
    const csv = Papa.unparse(data);
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    link.download = 'decathlon_results.csv';
    link.click();
  }
}
