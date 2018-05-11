import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { LoginPage } from '../pages/login/login';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, androidFullScreen: AndroidFullScreen) {
    platform.ready().then(() => {
      //statusBar.styleDefault();

      if (platform.is('android')) {
      	statusBar.backgroundColorByHexString("#00000000");
      }

    });
  }
}
