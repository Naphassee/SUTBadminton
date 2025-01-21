import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MyprofileComponent } from './components/manager/myprofile/myprofile.component';
import { PaymentComponent } from './components/manager/payment/payment.component';
import { PlayerAddComponent } from './components/manager/player-add/player-add.component';
import { PlayerListComponent } from './components/manager/player-list/player-list.component';
import { SandbagComponent } from './components/manager/sandbag/sandbag.component';
import { CreateTournamentComponent } from './components/organize/create-tournament/create-tournament.component';
import { MyProfileComponent } from './components/organize/my-profile/my-profile.component';
import { MyTournamentComponent } from './components/organize/my-tournament/my-tournament.component';
import { SidebarOrganizeComponent } from './components/organize/sidebar-organize/sidebar-organize.component';
import { TournamentReviewComponent } from './components/organize/tournament-review/tournament-review.component';
import { MembershipComponent } from './components/organize/membership/membership.component';
import { LocationAddComponent } from './components/organize/location-add/location-add.component';
import { OrganizeComponent } from './components/organize/organize.component';



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
        path: "organize",
        component: OrganizeComponent,
        children: [
            { path: "", redirectTo: "my-tournament", pathMatch: "full" },
            { path: "my-tournament", component: MyTournamentComponent },
            { path: "create-tournament", component: CreateTournamentComponent },
            { path: "my-profile", component: MyProfileComponent },
            { path: "tournament-review", component: TournamentReviewComponent },
            { path: "membership", component: MembershipComponent },
            { path: "location-add", component: LocationAddComponent },
        ]
    },
];
