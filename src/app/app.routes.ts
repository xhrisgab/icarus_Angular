import { Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { ControlComponent } from './pages/control/control.component';

export const routes: Routes = [
    {
        path:'',
        component: HomePageComponent,
    },
    {
        path:'control',
        component: ControlComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
