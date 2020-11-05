import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MaterialModule } from './global/material.module';
import { FormsModule } from '@angular/forms';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ManagerComponent } from './manager/manager.component';
import { AuthService } from './services/auth.service';
import { ManagerService } from './services/manager.service';
import { DebtService } from './services/debt.service';
import { DebtItemComponent } from './manager/components/debt-item/debt-item.component';
import { DebtDetailsComponent } from './manager/components/debt-details/debt-details.component';
import { DebtAddComponent } from './manager/components/debt-add/debt-add.component';
import { RadialDialComponent } from './manager/components/radial-dial/radial-dial.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HistoryComponent } from './manager/components/debt-details/history/history.component';
import { firebaseConfig } from '../../firebaseconfig';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ManagerComponent,
    DebtItemComponent,
    DebtDetailsComponent,
    DebtAddComponent,
    RadialDialComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule
  ],
  providers: [AuthService, ManagerService, DebtService],
  bootstrap: [AppComponent],
  entryComponents: [DebtAddComponent]
})
export class AppModule { }
