import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "account",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../account/account.module").then(m => m.AccountPageModule)
          }
        ]
      },
      {
        path: "collection",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../collection/collection.module").then(
                m => m.CollectionPageModule
              )
          }
        ]
      },
      {
        path: "setting",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../setting/setting.module").then(m => m.SettingPageModule)
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/account",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/account",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
