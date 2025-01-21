import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MyprofileComponent } from './components/manager/myprofile/myprofile.component';
import { PaymentComponent } from './components/manager/payment/payment.component';
import { PlayerAddComponent } from './components/manager/player-add/player-add.component';
import { PlayerListComponent } from './components/manager/player-list/player-list.component';
import { SandbagComponent } from './components/manager/sandbag/sandbag.component';



export const routes: Routes = [
    {
        path : "",
        component:HomeComponent,
    },
    {
        path : "register",
        component:RegisterComponent,
    },
    {
        path : "login",
        component:LoginComponent,
    },
    {
        path : "myprofile",
        component:MyprofileComponent,
    },
    {
        path : "register",
        component:RegisterComponent,
    },
    {
        path : "payment",
        component:PaymentComponent,
    },
    {
        path : "player-add",
        component:PlayerAddComponent,
    },
    {
        path : "player-list",
        component:PlayerListComponent,
    },
    {
        path : "sandbag",
        component:SandbagComponent,
    },
    {
        path : "home",
        component:HomeComponent,
    },
];
