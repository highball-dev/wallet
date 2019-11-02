import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import {
  AngularFireStorage,
  AngularFireUploadTask,
  AngularFireStorageReference
} from "@angular/fire/storage";
import { Observable } from "rxjs";
import { Status } from "../enum/status.enum";

export interface Receipt {
  id: string;
  name: string;
  description: string;
  status: Status;
  image?: string;
}

export interface Billing {
  id: string;
  receiptID: string;
  addressID: string;
  sourceID: string;
  price: number;
  status: Status;
}

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  constructor(
    public angularfireDatabase: AngularFireDatabase,
    public angularfireStorage: AngularFireStorage
  ) {}

  public fetchDatabase(): Observable<any> {
    return this.angularfireDatabase.list("receipt").valueChanges();
  }

  public createPushId(): string {
    return this.angularfireDatabase.createPushId();
  }

  public createReceipt(
    id: string,
    group: string,
    name: string,
    description: string,
    imageURL: string
  ): Promise<any> {
    if (!id) {
      id = this.angularfireDatabase.createPushId();
    }
    const itemRef = this.angularfireDatabase.object(
      "receipt/" + group + "/" + id
    );
    const targetObject: Receipt = {
      id: id,
      name: name,
      description: description,
      status: Status.Waiting,
      image: imageURL ? imageURL : ""
    };
    return itemRef.set(targetObject);
  }

  // public editStatusReceipt(Receipt: Receipt): Promise<any> {
  //   const itemRef = this.angularfireDatabase.object("receipt/" + Receipt.id);
  //   return itemRef.update(Receipt);
  // }

  public uploadImage(imageBlob: Blob, path: string): AngularFireUploadTask {
    return this.angularfireStorage.ref(path).put(imageBlob);
  }

  public getStorageReference(imagePath: string): AngularFireStorageReference {
    return this.angularfireStorage.ref(imagePath);
  }

  public createBilling(
    receiptID: string,
    group: string,
    addressID: string,
    sourceID: string,
    price: number
  ): Promise<any> {
    const billingID: string = this.angularfireDatabase.createPushId();
    const itemRef = this.angularfireDatabase.object(
      "billing/" + group + "/" + addressID + "/" + billingID
    );
    const targetObject: Billing = {
      id: billingID,
      receiptID: receiptID,
      addressID: addressID,
      sourceID: sourceID,
      price: price,
      status: Status.Waiting
    };
    return itemRef.set(targetObject);
  }
}
