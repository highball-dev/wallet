import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import {
  AngularFireStorage,
  AngularFireUploadTask,
  AngularFireStorageReference
} from "@angular/fire/storage";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Status } from "../enum/status.enum";
import { User } from "../model/user";

export interface Receipt {
  id: string;
  name: string;
  description: string;
  sourceID: string;
  sourceSlackID: string;
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
  sourceSlackID: string;
}

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  constructor(
    public angularfireDatabase: AngularFireDatabase,
    public angularfireStorage: AngularFireStorage
  ) {}

  public fetchDatabase(me: User): Observable<any> {
    console.log("billing/" + me.group + "/" + me.uid);
    return this.angularfireDatabase
      .list("billing/" + me.group + "/" + me.uid)
      .valueChanges();
    // return this.angularfireDatabase
    //   .list("billing/" + me.group + "/" + 1)
    //   .valueChanges();
  }

  public createPushId(): string {
    return this.angularfireDatabase.createPushId();
  }

  public createReceipt(
    id: string,
    sourceID: string,
    sourceSlcakID: string,
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
      sourceID: sourceID,
      sourceSlackID: sourceSlcakID,
      status: Status.Waiting,
      image: imageURL ? imageURL : ""
    };
    return itemRef.set(targetObject);
  }

  // public editStatusReceipt(Receipt: Receipt): Promise<any> {
  //   const itemRef = this.angularfireDatabase.object("receipt/" + Receipt.id);
  //   return itemRef.update(Receipt);
  // }

  public getReceipt(me: User, receiptID: string): Observable<Receipt> {
    const obj: AngularFireObject<Receipt> = this.angularfireDatabase.object(
      "receipt/" + me.group + "/" + me.uid + "/" + receiptID
    );
    // return this.angularfireDatabase
    //   .object("receipt/" + me.group + "/" + me.uid + "/" + receiptID)
    return obj.valueChanges();
  }

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
    sourceSlackID: string,
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
      sourceSlackID: sourceSlackID,
      status: Status.Waiting
    };
    return itemRef.set(targetObject);
  }

  public updateStatus(
    status: Status,
    billingID: string,
    group: string,
    addressID: string
  ): Promise<any> {
    const itemRef = this.angularfireDatabase.object(
      "billing/" + group + "/" + addressID + "/" + billingID
    );
    console.log("billing/" + group + "/" + addressID + "/" + billingID);
    return itemRef.update({
      status: status
    });
  }
}
