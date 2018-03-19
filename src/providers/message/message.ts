import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Auth } from '../auth/auth';
import 'rxjs/add/operator/map';

@Injectable()
export class Message {

  constructor(public http: Http, public authService: Auth) {

  }

  storeMessage(msg) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authService.token);

    return new Promise((resolve, reject) => {
      this.http.post('https://stetter-prueba.herokuapp.com/api/messages', JSON.stringify(msg), {headers: headers})
      //this.http.post('http://localhost:8080/api/messages', JSON.stringify(msg), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


}
