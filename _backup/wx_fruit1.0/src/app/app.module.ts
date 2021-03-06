import { BrowserModule, } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Content } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule  } from "@angular/platform-browser/animations";


//pages
import { MyApp } from './app.component';
import { MyPage } from '../pages/my/my';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';
import { TabsPage } from '../pages/tabs/tabs';

//cordova plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { IonicStorageModule } from '@ionic/storage';
//pipie
import { CartFilterPipe } from '../pipes/cart-pipe';

//provider
import { AuthProvider } from '../providers/auth';
import { AppService } from './app.service'
import{ HttpService} from '../providers/HttpService'

import {PipesModule} from '../pipes/pipes.module'

import * as $ from 'jquery';
// import { AppUpdate } from '@ionic-native/app-update';


@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    CartPage,
    MyPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    CartPage,
    MyPage,
    HomePage,
    TabsPage
  ],
  providers: [
    Content,
    // AppUpdate,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppService,
    HttpService,
    Geolocation, BarcodeScanner,
    AuthProvider
  ]
})
export class AppModule {
}
