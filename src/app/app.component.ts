import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { LoginPage } from '../pages/login/login';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar) {
    platform.ready().then(() => {
      statusBar.styleDefault();
    });
  }
}
