import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./feature/home/home.module').then(m => m.HomeModule) },
  { path: 'welcome', loadChildren: () => import('./feature/landing-page/landing-page.module').then(m => m.LandingPageModule) },
  { path: 'public', loadChildren: () => import('./feature/public/public.module').then(m => m.PublicModule) },
  { path: 'private', loadChildren: () => import('./feature/private/private.module').then(m => m.PrivateModule) },
  { path: 'personal', loadChildren: () => import('./feature/personal/personal.module').then(m => m.PersonalModule) },
  { path: 'user-page', loadChildren: () => import('./feature/user-page/user-page.module').then(m => m.UserPageModule) },
  { path:  '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
