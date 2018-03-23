import { Component } from "@angular/core";
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Todos } from '../../providers/todos/todos';
import { Auth } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { Message } from '../../providers/message/message';
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
    public authService: Auth, public loadingCtrl: LoadingController,
    public messageService: Message, public storage: Storage) {

  }

  ionViewDidLoad(){

    this.getData();
    this.getUsers();

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

  sendMessage() {

    if (this.message === undefined) {
      alert("You should write a message");
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
      alert("Your message has been sent correctly");
    }, (err) => {
      console.log(err);
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
}
