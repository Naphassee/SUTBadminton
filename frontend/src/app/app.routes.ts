import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

// Manager
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ManagerComponent } from './components/manager/manager.component';
import { MyprofileComponent } from './components/manager/myprofile/myprofile.component';
import { PaymentComponent } from './components/manager/payment/payment.component';
import { PlayerAddComponent } from './components/manager/player-add/player-add.component';
import { PlayerListComponent } from './components/manager/player-list/player-list.component';
import { SandbagComponent } from './components/manager/sandbag/sandbag.component';
import { TournamentListComponent } from './components/manager/tournament-list/tournament-list.component';

// Organizer
import { RegisterOrganizerComponent } from './components/organize/register-organizer/register-organizer.component';
import { LoginOrganizerComponent } from './components/organize/login-organizer/login-organizer.component';
import { OrganizeComponent } from './components/organize/organize.component';
import { MyTournamentComponent } from './components/organize/my-tournament/my-tournament.component';
import { AllTournamentComponent } from './components/organize/all-tournament/all-tournament.component';
import { CreateTournamentComponent } from './components/organize/create-tournament/create-tournament.component';
import { EditTournamentComponent } from './components/organize/edit-tournament/edit-tournament.component';
import { MyProfileComponent } from './components/organize/my-profile/my-profile.component';
import { EditProfileComponent } from './components/organize/edit-profile/edit-profile.component';


// Admin
import { UserListComponent } from './components/admin/user-list/user-list.component';

// Guard ป้องกันการเข้าไปยังหน้าใช้งานต่างๆโดยที่ยังไม่ได้ login
import { AuthGuard } from './core/guards/auth.guard';

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


    // Manager
    {
        path: 'manager',
        component: ManagerComponent,
        canActivate: [AuthGuard],
        data: { roles: ['manager'] },
        children: [
            { path: '', redirectTo: 'tournament-list', pathMatch: 'full' },      // redirect เป๊ะ ๆ ต้องมี pathMatch
            { path: 'player-list', component: PlayerListComponent },
            { path: 'myprofile',    component: MyprofileComponent },
            { path: 'payment',      component: PaymentComponent },
            { path: 'player-add',   component: PlayerAddComponent },
            { path: 'sandbag',      component: SandbagComponent },
            { path : "tournament-list",component:TournamentListComponent },
        ]
    },

    // Organizer
    {
        path: "organize",
        component: OrganizeComponent,
        canActivate: [AuthGuard],
        data: { roles: ['organizer'] },
        children: [
            { path: "", redirectTo: "my-tournament", pathMatch: "full" },
            { path: "my-tournament", component: MyTournamentComponent },
            { path: "all-tournament", component: AllTournamentComponent},
            { path: "create-tournament", component: CreateTournamentComponent },
            { path: "edit-tournament/:id", component: EditTournamentComponent },
            { path: "my-profile", component: MyProfileComponent},
            { path: 'edit-profile', component: EditProfileComponent},
        ]
    },
    { 
        path: "register-organizer",
        component: RegisterOrganizerComponent
    },
    { 
        path: "login-organizer",
        component: LoginOrganizerComponent
    },

    // Admin
    {
        path: "user-list",
        component: UserListComponent,
    },
];
