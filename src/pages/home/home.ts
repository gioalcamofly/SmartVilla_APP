import { Component } from "@angular/core";
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Todos } from '../../providers/todos/todos';
import { Auth } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { Message } from '../../providers/message/message';
import { Platform, ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import * as bcryptjs from 'bcryptjs';
declare var cordova: any;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  message: string;
  public userInfo: any;
  public usersList: any;
  public userShow: any;
  loading: any;




  constructor(public navCtrl: NavController, public todoService: Todos, public modalCtrl: ModalController,
    public authService: Auth, public loadingCtrl: LoadingController, public camera: Camera,
    public messageService: Message, public storage: Storage, public alertCtrl: AlertController,
    public platform: Platform, public actionsheetController: ActionSheetController) {

  }

  ionViewDidLoad(){

    this.getData();
    this.getUsers();

  }


  settings() {
    let actionSheet = this.actionsheetController.create({
      title: 'Accounts Settings',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text:'Take new photo',
          icon: 'camera',
          handler: () => {
            console.log("camera clicked");
            this.takePhoto();
          }
        },
        {
          text: 'Change personal information',
          icon: 'person',
          handler: () => {
            console.log("Change name clicked");
            this.usernamePrompt();
          }
        },
        {
          text: 'Change password',
          icon: 'lock',
          handler: () => {
            console.log("Password clicked");
            this.passwordPrompt();
          }
        },
        {
          text: 'Delete account',
          role: 'destructive',
          cssClass: 'rojo',
          icon: 'trash',
          handler: () => {
            console.log("Delete clicked");
            this.deleteUser();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  usernamePrompt() {
    let alert = this.alertCtrl.create({
      title: 'Change name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value: this.userInfo.name
        },
        {
          name: 'surname',
          placeholder: 'Surname',
          value: this.userInfo.surname
        },
        {
          name: 'email',
          placeholder: 'Email',
          value: this.userInfo.email
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            //console.log('Confirm clicked');
            if (!data.name || !data.surname || !data.email) {
              this.failedAlert("Data missed", "Fulfill all data, please", 1);
            } else if (!this.emailValidate(data.email)) {
              this.failedAlert("Wrong email", "Please, enter a valid email address", 1);
            } else {
              this.authService.changeData(data).then(res => {
                if (this.userInfo.name != data.name || this.userInfo.surname != data.surname) { //The name has changed, so has to the photos
                    var newFilename = "/" + data.name + " " + data.surname + ".jpg";
                    var oldFilename = "/" + this.userInfo.name + " " + this.userInfo.surname + ".jpg";
                    this.authService.changePhotoName(oldFilename, newFilename);
                }
                this.ionViewDidLoad();
              }, err => {
                console.log(err);
                this.failedAlert("Internal error", "Error while changing data. Please, try again", 1);
              });
            }
          }
        }
      ]
    });
    alert.present();
  }


  failedAlert(error, text, func) {
    let alert = this.alertCtrl.create({
      title: error,
      subTitle: text,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if (func == 1) {
              this.usernamePrompt();
            } else if (func == 2) {
              this.passwordPrompt();
            }
          }
        }
      ]
    });
    alert.present();
  }

  passwordPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Set new password',
      inputs: [
        {
          name: 'oldPasswd',
          placeholder:'Old password',
          type: 'password',
          checked: true
        },
        {
          name: 'newPasswd',
          placeholder: 'New password',
          type: 'password',
          checked: true
        },
        {
          name: 'rptPasswd',
          placeholder: 'Repeat password',
          type: 'password',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            console.log(data.oldPasswd);
            console.log(this.userInfo.password);
            console.log(this.userInfo.name);
            if(!data.oldPasswd || !data.newPasswd || !data.rptPasswd) {
              this.failedAlert("Data missed", "Please, fulfill the labels", 2);
            } else if (!bcryptjs.compareSync(data.oldPasswd, this.userInfo.password)) {
              this.failedAlert("Wrong password", "Old password is incorrect", 2);
            } else if (!this.passValidate(data.newPasswd)) {
              this.failedAlert("Wrong password", "The new password must have at least 8 characters, one number and one uppercase letter", 2);
            } else if (data.newPasswd != data.rptPasswd){
              this.failedAlert("Wrong password", "The passwords don't match", 2);
            } else {
              this.authService.changePasswd(data.newPasswd).then(res => {
                this.ionViewDidLoad();
              }, err => {
                this.failedAlert("Internal error", "Error while updating the password. Please try again", 2);
              });
            }
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

  showLoader(){

    this.loading = this.loadingCtrl.create({
      content: 'Sending...'
    });

    this.loading.present();

  }

  logout(){

    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);

  }

  deleteUser() {
    var filename = this.userInfo.name + " " + this.userInfo.surname + ".jpg";
    this.authService.deletePhoto(filename).then(result => {
      console.log("Image deleted succesfully");
    }, err => {
      console.log(err);
      this.failedAlert("Internal error", "Error while deleting the old image, please try again", 0);
      return;
    });
    this.authService.deleteUser(this.userInfo._id).then((result) => {
      console.log(result);
      this.failedAlert("Success", "Your account have been deleted succesfully", 0);
      this.logout();
    }, (err) => {
      console.log(err);
      this.failedAlert("Internal error", "Your account couldn't be deleted. Please try again", 0);
    });
  }

  sendMessage() {

    if (this.message === undefined) {
      this.failedAlert("Data missed", "You should write a message", 0);
      return;
    }
    this.showLoader()

    let data = {
      from: this.userInfo.name + " " + this.userInfo.surname,
      to: this.userShow.name + " " + this.userShow.surname,
      message: this.message
    }


    this.messageService.storeMessage(data).then((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
      this.failedAlert("Internal error", "There has been an error while uploading your message. Please try again", 0);
    });
  }

  getData() {
    this.storage.get('userData').then((value) => {
      this.userInfo = value;
    });
  }

  getUsers() {
    this.authService.userList().then((value) => {
      this.usersList = value;
      this.userShow = value[0];
    });
  }

  takePhoto() {
    var filename = "/" + this.userInfo.name + " " + this.userInfo.surname + ".jpg";


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
        //this.residency_image = new_path;
        this.authService.deletePhoto(filename).then(result => {
          console.log("Image deleted succesfully");
        }, err => {
          console.log(err);
          this.failedAlert("Internal error", "Error while deleting the old image, please try again", 0);
          return;
        });
        this.authService.uploadImage(new_path, filename);
    }, (err) => {
        this.failedAlert("Internal error", "Error while taking the picture", 0);
    });
  }
}
