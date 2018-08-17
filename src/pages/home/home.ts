import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { WeatherProvider } from '../../providers/weather/weather';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  locationDialog: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private geolocation: Geolocation, private weather: WeatherProvider, private nativeStorage: NativeStorage, public platform: Platform) {
    this.locationDialog = this.loadingCtrl.create({
      content: 'Checking for your location...'
    });
    
    if ( this.platform.is('cordova') ) {
      console.log(this.get_saved_location());
    }
  }

  async get_saved_location() {
    const value = <Object> await this.nativeStorage.getItem('location');
  }

  ionViewDidLoad() {

    this.locationDialog.present();

    this.geolocation.getCurrentPosition().then((resp) => {

      this.locationDialog.dismiss();
      this.weather.setLocation(resp.coords);

      this.weather.fetch().subscribe((data) => {
        console.log('Outer subscribe');
        console.log(data);
      });

    }).catch((error) => {
      console.log('Error getting location: ', error);
      this.locationDialog.dismiss();
    });

  }

}

/*let watch = this.geolocation.watchPosition();

watch.subscribe((data) => {
 // data.coords.latitude
 // data.coords.longitude
});*/

