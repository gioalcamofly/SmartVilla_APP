import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Dropbox } from 'dropbox';
import 'rxjs/add/operator/map';

@Injectable()
export class Auth {

  public token: any;
  public userData: any;

  constructor(public http: Http, public storage: Storage, public file: File, public transfer: FileTransfer) {

  }

  checkAuthentication(){

    return new Promise((resolve, reject) => {

        //Load token if exists
        this.storage.get('token').then((value) => {

            this.token = value;

            let headers = new Headers();
            headers.append('Authorization', this.token);

            this.http.get('https://stetter-prueba.herokuapp.com/api/auth/protected', {headers: headers})
            //this.http.get('http://localhost:8080/api/auth/protected', {headers:headers})
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });

        });

        this.storage.get('userData').then((value) => {
          this.userData = value;
        });

    });

  }



  createAccount(details){

    return new Promise((resolve, reject) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('https://stetter-prueba.herokuapp.com/api/auth/register', JSON.stringify(details), {headers: headers})
        //this.http.post('http://localhost:8080/api/auth/register', JSON.stringify(details), {headers: headers})
          .subscribe(res => {

            let data = res.json();
            this.token = data.token;
            this.userData = data.user;
            this.storage.set('token', data.token);
            this.storage.set('userData', data.user);
            resolve(data);

          }, (err) => {
            reject(err);
          });

    });

  }


  deleteUser(id) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Authorization' , this.token);
      this.http.delete('https://stetter-prueba.herokuapp.com/api/auth/delete/' + id, {headers: headers})
      //this.http.delete('http://localhost:8080/api/auth/delete/' + id, {headers: headers})
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  login(credentials){

    return new Promise((resolve, reject) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post('https://stetter-prueba.herokuapp.com/api/auth/login', JSON.stringify(credentials), {headers: headers})
        //this.http.post('http://localhost:8080/api/auth/login', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {

            let data = res.json();
            this.token = data.token;
            this.userData = data.user;
            this.storage.set('token', data.token);
            this.storage.set('userData', data.user);
            resolve(data);

            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  userList() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.token);

    return new Promise((resolve, reject) => {
      this.http.get('https://stetter-prueba.herokuapp.com/api/auth/list', {headers: headers})
      //this.http.get('http://localhost:8080/api/auth/list', {headers: headers})
        .subscribe(res => {
          let data = res.json();
          //console.log(data.userList);
          resolve(data.userList);
        }, (err) => {
          reject(err);
        });

    });
  }

  uploadImage(residency_image, filename) { //imagePath
      var url = "https://content.dropboxapi.com/2/files/upload";

      let args = {
        "path": "/" + filename,
        "mode": "add",
        "autorename": true,
        "mute": false
      }

      /*var targetPath = this.pathForImage(this.residency_image);
      console.log(targetPath);
      console.log(this.residency_image);*/


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

      /*this.http.post(url, this.residency_image, {headers: headers});*/
      const filetransfer: FileTransferObject = this.transfer.create();

      //console.log(options);



      filetransfer.upload(residency_image, url, options).then(data => {
        //this.loading.dismiss();
        console.log("Image has been correctly uploaded");
        //console.log(data);
      }, err => {
        //this.loading.dismiss();
        //document.getElementById("tupac").innerHTML = JSON.stringify(err) ;
        alert("Error while uploading image");
        /*alert(err);
        console.log("Error al subir la imagen");
        console.log(err);*/
      });
  }

  logout(){
    this.storage.set('token', '');
  }

  changePasswd(password) {
    return new Promise((resolve, reject) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization' , this.token);
        var newPassword = {
          id: this.userData._id,
          password: password
        };

        this.http.post('https://stetter-prueba.herokuapp.com/api/auth/updatePassword', JSON.stringify(newPassword), {headers: headers})
        //this.http.post('http://localhost:8080/api/auth/updatePassword', JSON.stringify(newPassword), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.userData.password = data.password;
            console.log(data.password);
            this.storage.set('userData', this.userData);
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  changeData(data) {
    return new Promise((resolve, reject) => {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization' , this.token);
        var newCredentials = {
          id: this.userData._id,
          name: data.name,
          surname: data.surname,
          email: data.email
        };
        console.log(newCredentials);

        this.http.post('https://stetter-prueba.herokuapp.com/api/auth/updateUserData', JSON.stringify(newCredentials), {headers: headers})
        //this.http.post('http://localhost:8080/api/auth/updateUserData', JSON.stringify(newCredentials), {headers: headers})
          .subscribe(res => {
            this.userData.name = data.name;
            console.log(data.name);
            console.log(data.surname);
            this.userData.surname = data.surname;
            this.storage.set('userData', this.userData);
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  /*deletePhoto(filename) {
    var path = "/Aplicaciones/SmartVilla/" + filename;
    let data = { path : path };
    console.log(path);
    //var data = { path : path};
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + 'FmcBBiviaJAAAAAAAAAADxvxdjxe_YJZlaHAswciEBVeSgTBFDYbVF2YJIo_RPLd');
    headers.append('Content-Type', 'application/json');
    return new Promise((resolve, reject) => {
      this.http.post("https://api.dropboxapi.com/2/files/delete_v2", JSON.stringify(data), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }*/
  deletePhoto(filename) {
    var dbx = new Dropbox({ accessToken: 'FmcBBiviaJAAAAAAAAAADxvxdjxe_YJZlaHAswciEBVeSgTBFDYbVF2YJIo_RPLd'});
    return new Promise((resolve, reject) => {
      dbx.filesDeleteV2({path: filename}).then(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });

  }

  changePhotoName(oldFilename, newFilename) {
    var dbx = new Dropbox({ accessToken: 'FmcBBiviaJAAAAAAAAAADxvxdjxe_YJZlaHAswciEBVeSgTBFDYbVF2YJIo_RPLd'});
    return new Promise((resolve, reject) => {
      let args = {
          from_path: oldFilename,
          to_path: newFilename
      }
      dbx.filesMoveV2(args).then(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

}
