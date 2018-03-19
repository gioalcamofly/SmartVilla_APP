import { Component } from "@angular/core";
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Todos } from '../../providers/todos/todos';
import { Auth } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { Message } from '../../providers/message/message';
import { Http, Headers } from '@angular/http';
//import { Cam } from '../../providers/camera/camera';import {Camera} from 'ionic-native';
import {Camera} from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';

/*declare function require(name: string);

var Dropbox = require('dropbox').Dropbox;*/

declare var cordova: any;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  //todos: any;
  message: string;
  public userInfo: any;
  public usersList: any;
  public userShow: any;
  public lastImage: string = null;
  loading: any;
  public residency_image: string = null;


  constructor(public navCtrl: NavController, public todoService: Todos, public modalCtrl: ModalController,
    public authService: Auth, public loadingCtrl: LoadingController,
    public messageService: Message, public storage: Storage, public camera: Camera, public file: File,
    private transfer: FileTransfer, private http: Http) {

  }

  ionViewDidLoad(){

    /*this.todoService.getTodos().then((data) => {
          this.todos = data;
    }, (err) => {
        console.log("not allowed");
    });*/
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
    console.log(this.message);
    console.log(this.usersList);
    this.showLoader()

    let data = {
      from: this.userInfo.name + " " + this.userInfo.surname,
      to: this.userShow.name + " " + this.userShow.surname,
      message: this.message
    }


    this.messageService.storeMessage(data).then((result) => {
      //this.loading.dismiss();
      console.log(result);
      alert("Your message has been sent correctly");
    }, (err) => {
      //this.loading.dismiss();
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


  /*dropboxPrueba(imageData) {
    var f = new File([imageData], this.userInfo.name + " " + this.userInfo.surname + ".jpg", {type: "image/jpeg"});
    var dbx = new Dropbox({ accessToken: 'FmcBBiviaJAAAAAAAAAACbdKrofn-ddsbVZSHo_6v7oTw_tT650LYxgmbZ67xcet'});
    dbx.filesUpload({ path: '/' + this.userInfo.name + " " + this.userInfo.surname + ".jpg", contents: f})
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }*/


  private copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log(namePath);
    console.log(currentName);
    console.log(newFileName);
    console.log(cordova.file.dataDirectory);
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      //this.uploadImage();
    }, error => {
      console.log("Error while copying file");
    });
  }


  takePhoto() {

    var options = {
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
      //targetWidth: 1000,
      //targetHeight: 1000,
      //cameraDirection: 1,
      //saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
        //var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(imageData);
        let new_path = imageData.substring(imageData.indexOf('s'));
        this.residency_image = new_path;
        console.log(this.residency_image);
        alert(imageData);
        this.uploadImage();
        //this.copyFileToLocalDir(correctPath, currentName, this.userInfo.name + " " + this.userInfo.surname + ".jpg");
    }, (err) => {
        console.log(err);
    });

  }

  pathForImage(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  }

  uploadImage() { //imagePath
    var url = "https://content.dropboxapi.com/2/files/upload";

    let args = {
      "path": "/" + this.userInfo.name + " " + this.userInfo.surname + ".jpg",
      "mode": "add",
      "autorename": true,
      "mute": false
    }

    var targetPath = this.pathForImage(this.residency_image);
    console.log(targetPath);
    console.log(this.residency_image);
    var filename = this.userInfo.name + " " + this.userInfo.surname + ".jpg";

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + 'FmcBBiviaJAAAAAAAAAADxvxdjxe_YJZlaHAswciEBVeSgTBFDYbVF2YJIo_RPLd');
    headers.append('Dropbox-API-Arg', JSON.stringify(args));
    headers.append('Content-Type', 'application/octet-stream');

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
      //params : {'filename': this.userInfo.name + " " + this.userInfo.surname},
      headers : headers
    };

    this.http.post(url, this.residency_image, {headers: headers});
    /*const filetransfer: FileTransferObject = this.transfer.create();

    console.log(options);*/



    /*filetransfer.upload(this.residency_image, url, options).then(data => {
      //this.loading.dismiss();
      console.log("Imagen subida correctamente");
      console.log(data);
    }, err => {
      //this.loading.dismiss();
      document.getElementById("tupac").innerHTML = JSON.stringify(err) ;
      alert("Error al subir la imagen");
      alert(err);
      console.log("Error al subir la imagen");
      console.log(err);
    });*/
  }

}


//storage/emulated/0/Android/data/io.ionic.starter/cache/1521473631069.jpg
