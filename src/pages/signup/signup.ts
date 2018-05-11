import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';
import { EmailValidator } from '@angular/forms';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {

  email: string;
  password: string;
  name: string;
  surname: string;
  conPassword: string;
  loading: any;
  public residency_image: string = null;
  constructor(public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController, public camera: Camera,
              private alertCtrl: AlertController) {

  }

  register(){

    this.showLoader("Registration in process");

    let details = {
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname
    };


    this.authService.createAccount(details).then((result) => {
      this.loading.dismiss();
      console.log(result);
      this.failedAlert("Contratulations!", "You have been correctly registered");
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
        this.loading.dismiss();
    });

  }

  showLoader(content){

    this.loading = this.loadingCtrl.create({
      content: content
    });

    this.loading.present();

  }

  failedAlert(error, text) {
    let alert = this.alertCtrl.create({
      title: error,
      subTitle: text,
      buttons: ['Ok']
    });
    alert.present();
  }

  confirmation() {
    let alert = this.alertCtrl.create({
      title: 'Use conditions',
      message: 'A photo of your face is needed to make face recognition possible.\
                We guarantee that we are not going to use your image for other purposes.\
                By clicking "Agree" you will accept this conditions',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.takePhoto();
          }
        }
      ]
    });
    alert.present();
  }

  emailValidate(email) {
    var re = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
    return email.match(re);
  }

  passValidate(password) {
    var re = "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}";
    return password.match(re);
  }

  signUp() {
    if (this.email === undefined|| this.password === undefined || this.name === undefined || this.surname === undefined) {
      this.failedAlert("Data missed", "You must fulfill all the labels");
      return;
    }

    if (!this.emailValidate(this.email)) {
        this.failedAlert("Wrong email", "You should enter a valid email address");
        return;
    }
    if (!this.passValidate(this.password)) {
        this.failedAlert("Wrong password", "The password must have at least 8 characters, one number and one uppercase and lowercase letter");
        return;
    }

    if(this.password != this.conPassword) {
      this.failedAlert("Wrong password", "The passwords must be the same");
      return;
    }

    this.confirmation();
  }

  takePhoto() {

    var filename = this.name + " " + this.surname + ".jpg";
    var options = {
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1280,
      targetHeight: 720,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
        let new_path = imageData.substring(imageData.indexOf('s'));
        this.residency_image = new_path;
        this.authService.uploadImage(this.residency_image, filename);
        this.register();
    }, (err) => {
        this.failedAlert("Internal error", "Error while taking the picture");
    });
  }

}
