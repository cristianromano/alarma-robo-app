import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { HomePageModule } from 'src/app/home/home.module';
const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./registro/registro.module').then((m) => m.RegistroPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('../../home/home.module').then((m) => m.HomePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
