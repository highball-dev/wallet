import { Component, ViewChild, ElementRef } from "@angular/core";
import { FirebaseService } from "../service/firebase.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  ActionSheetController,
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { LoadingService } from "../service/loading.service";
import { finalize } from "rxjs/operators";
import {
  AngularFireUploadTask,
  AngularFireStorageReference
} from "@angular/fire/storage";
import { DutchPage } from "../dutch/dutch.page";
import { AuthService } from "../service/auth.service";
import { User } from "../model/user";
import { Router } from "@angular/router";
import { TutorialPage } from "../tutorial/tutorial.page";

@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"]
})
export class AccountPage {
  me: User;
  pushId: string;
  name: string;
  description: string;
  url: string;

  ready: boolean = true;

  @ViewChild("frontFile", { static: true })
  frontFileElement: ElementRef;

  constructor(
    public firebase: FirebaseService,
    public auth: AuthService,
    public loading: LoadingService,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    private router: Router
  ) {
    // FIXME:
    this.auth.getAfUser().subscribe(afUser => {
      this.auth.getUser(afUser.uid).subscribe(user => {
        this.me = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          group: user.group
        };
        if (!this.me.group) {
          this.openGroupAlert();
        }
      });
    });
  }

  ionViewDidEnter() {
    // if (localStorage.getItem("firstlogin")) {
    //   localStorage.removeItem("firstlogin");
    //   this.openShowTutorial();
    // }
  }

  async openGroupAlert() {
    const alert = await this.alertCtrl.create({
      header: "グループが設定されていません",
      buttons: [
        {
          text: "設定する",
          handler: () => {
            this.router.navigate(["tabs/setting"]);
          }
        }
      ]
    });
    await alert.present();
  }

  // async openShowTutorial() {
  //   const modal = await this.modalController.create({
  //     component: TutorialPage
  //   });
  //   return await modal.present();
  // }

  addReceipt(): void {
    if (!this.pushId) {
      this.pushId = this.firebase.createPushId();
    }
    console.log(this.me);
    this.firebase
      .createReceipt(
        this.pushId,
        this.me.group,
        this.name,
        this.description,
        this.url
      )
      .then((receipt: any) => {
        this.resetInputFiles();
        this.showDutchModal().then(() => {});
        this.pushId = "";
        this.name = "";
        this.description = "";
        this.url = "";
      })
      .catch(err => {
        console.log(err);
      });
  }

  async showDutchModal(): Promise<any> {
    console.log(this.me);
    const modal = await this.modalController.create({
      component: DutchPage,
      componentProps: {
        receiptID: this.pushId,
        sourceID: this.me.uid,
        group: this.me.group,
        title: this.name,
        description: this.description
      }
    });
    return await modal.present();
  }

  changeFile(event: any): void {
    this.ready = false;
    const file: Blob = event.target.files[0];
    if (!file) {
      return;
    }
    this.readFile(this.uploadFile.bind(this), file);
  }

  private readFile(callback: Function, file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const file_base64 = new String(reader.result).split(",");
      callback(this.toBlob(file_base64[1]));
    };
  }

  async uploadFile(blobImage: Blob) {
    if (!this.pushId) {
      this.pushId = this.firebase.createPushId();
      console.log(this.pushId);
    }

    const task: AngularFireUploadTask = this.firebase.uploadImage(
      blobImage,
      "receipt_img/" + this.pushId + "/"
    );
    const ref: AngularFireStorageReference = this.firebase.getStorageReference(
      "receipt_img/" + this.pushId + "/"
    );
    task
      .snapshotChanges()
      .pipe(
        finalize(() =>
          ref.getDownloadURL().subscribe((url: string) => {
            this.url = url;
            this.ready = true;
          })
        )
      )
      .subscribe();
  }

  private resetInputFiles() {
    if (
      this.frontFileElement.nativeElement &&
      this.frontFileElement.nativeElement.value
    ) {
      this.frontFileElement.nativeElement.value = "";
    }
  }

  private toBlob(imageData: string): Blob {
    const bin = atob(imageData.replace(/^.*,/, ""));
    let buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: "image/png" });
    return blob;
  }
}
