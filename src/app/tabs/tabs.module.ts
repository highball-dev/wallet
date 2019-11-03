import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TabsPageRoutingModule } from "./tabs.router.module";

import { TabsPage } from "./tabs.page";
import { DutchPage } from "../dutch/dutch.page";
import { TutorialPage } from "../tutorial/tutorial.page";
import { DutchPageModule } from "../dutch/dutch.module";
import { TutorialPageModule } from "../tutorial/tutorial.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    DutchPageModule,
    TutorialPageModule
  ],
  entryComponents: [DutchPage, TutorialPage],
  declarations: [TabsPage]
})
export class TabsPageModule {}
