import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

@Injectable()
export class Message {

  constructor(public http: Http) {

  }

  storeMessage(msg) {

    return new Promise((resolve, reject) => {
      this.http.post('https://stetter-prueba.herokuapp.com/api/messages', JSON.stringify(msg))
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}
