import { Component } from "@angular/core";
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Todos } from '../../providers/todos/todos';
import { Auth } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { Message } from '../../providers/message/message';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  //todos: any;
  from: string;
  to: string;
  message: string;
  loading: any;

  constructor(public navCtrl: NavController, public todoService: Todos, public modalCtrl: ModalController,
    public alertCtrl: AlertController, public authService: Auth, public loadingCtrl: LoadingController,
    public messageService: Message) {

  }

  ionViewDidLoad(){

    /*this.todoService.getTodos().then((data) => {
          this.todos = data;
    }, (err) => {
        console.log("not allowed");
    });*/

  }


  showLoader(){

    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });

    this.loading.present();

  }

  logout(){

    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);

  }

  sendMessage() {
    console.log(this.from);
    console.log(this.to);
    console.log(this.message);

    let data = {
      from: this.from;
      to: this.to;
      message: this.message;
    }

    this.messageService.storeMessage(data).then((result) => {
      this.loading.dismiss();
      console.log(result);
      alert("Your message has been sent correctly");
    }, (err) => {
      this.loading.dismiss();
      console.log(err);
    });
  }

}
