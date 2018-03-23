import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {

  email: string;
  password: string;
  name: string;
  surname: string;
  loading: any;
  public residency_image: string = null;

  constructor(public navCtrl: NavController, public authService: Auth, public loadingCtrl: LoadingController, public camera: Camera) {

  }

  register(){

    this.showLoader("Register in process");

    let details = {
        email: this.email,
        password: this.password,
        name: this.name,
        surname: this.surname
    };


    this.authService.createAccount(details).then((result) => {
      this.loading.dismiss();
      console.log(result);
      alert("Contratulations! You have been correctly registered");
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

  takePhoto() {

    if (this.email === undefined|| this.password === undefined || this.name === undefined || this.surname === undefined) {
      alert("You must fulfill all the labels");
      return;
    }

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
        alert("Error while taking the picture");
    });


  }

}
