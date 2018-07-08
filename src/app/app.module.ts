import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GoogleApiModule, NG_GAPI_CONFIG, NgGapiClientConfig } from 'ng-gapi';
import { UserService } from './user.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes} from '@angular/router';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { TaskListComponent } from './task-list/task-list.component';
import {MaterialComponentsModule} from './material-components/material-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {TasklistService} from './tasklist.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FilterDatePipe } from './filter-date.pipe';
import {MatDialogConfig} from '@angular/material';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import {FormsModule} from '@angular/forms';
import { TaskDetailsComponent } from './task-details/task-details.component';

registerLocaleData(localePt);

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '259423854572-sn7c8h93r5i031iqais1ohndvp597j0t.apps.googleusercontent.com',
  discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  scope: ['https://www.googleapis.com/auth/tasks'].join(' ')
};

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, runGuardsAndResolvers: 'always'},
  { path: 'dashboard/:taskListId', component: DashboardComponent },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    PagenotfoundComponent,
    DashboardComponent,
    TaskListComponent,
    FilterDatePipe,
    AddTaskDialogComponent,
    TaskDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    RouterModule.forRoot(
      appRoutes, { useHash: true, onSameUrlNavigation: 'reload' }
    ),
    MarkdownModule.forRoot({loader: HttpClient}),
    FlexLayoutModule,
    HttpClientModule,
    FormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [UserService, TasklistService, MatDialogConfig, { provide: LOCALE_ID, useValue: 'pt-PT' }],
  bootstrap: [AppComponent],
  entryComponents: [AddTaskDialogComponent, TaskDetailsComponent]
})
export class AppModule { }
