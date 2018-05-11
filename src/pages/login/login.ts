import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { EmailValidator } from '@angular/forms';
import { AlertController } from 'ionic-angular';

@Component({
selector: 'login-page',
templateUrl: 'login.html'
})
export class LoginPage {

email: string;
password: string;
loading: any;

constructor(public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController,
            public alertCtrl: AlertController) {

}

ionViewDidLoad() {

    this.showLoader();

    this.authService.checkAuthentication().then((res) => {
        console.log("Already authorized");
        this.loading.dismiss();
        this.navCtrl.setRoot(HomePage);
    }, (err) => {
        console.log("Not already authorized");
        this.loading.dismiss();
    });

}

login(){

    if (this.email === undefined || this.password === undefined) {
      this.failedAlert("Data missed", "You must fulfill all the labels");
      return;
    }

    this.showLoader();

    let credentials = {
        email: this.email,
        password: this.password
    };

    this.authService.login(credentials).then((result) => {
        this.loading.dismiss();
        console.log(result);
        this.navCtrl.setRoot(HomePage);
    }, (err) => {
        this.loading.dismiss();
        this.failedAlert("Wrong data", "The user you introduced is not valid. Please, try again");
        console.log(err);
    });

}

launchSignup(){
    this.navCtrl.push(SignupPage);
}

failedAlert(error, text) {
  let alert = this.alertCtrl.create({
    title: error,
    subTitle: text,
    buttons: ['Ok']
  });
  alert.present();
}

showLoader(){

    this.loading = this.loadingCtrl.create({
        content: 'Authenticating...'
    });

    this.loading.present();

}

}
