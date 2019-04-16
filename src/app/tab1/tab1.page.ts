import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

// import { HealthKit } from '@ionic-native/health-kit/ngx';
import { Health } from '@ionic-native/health/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  platformReady: Boolean = false;
  stepsArray = [];
  stepsAggregated = []
  hasData = false;
  constructor(private health: Health, private platform: Platform) {

  }

  ngOnInit() {
    this.checkPlatformReady();
  }

  async checkPlatformReady() {
    const ready = !!await this.platform.ready();
    if (ready) {
      this.health.isAvailable().then(bool => {
        console.log("available " + bool);
        if (bool) {
          this.platformReady = true;
          this.health.requestAuthorization([
            'distance', 'nutrition',  //read and write permissions
            {
              read: ['steps','height', 'weight'],       //read only permission
              write: ['height', 'weight']  //write only permission
            }
          ])
          .then(res => console.log("response " + res))
          .catch(e => console.log("error "+e));
        }
      })
      .catch(e => console.log("error "+e));
    }
  }

  getSteps(){
    this.health.query({
      startDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000), // ten days ago
      endDate: new Date(), // now
      dataType: 'steps',
      limit: 1000
    }).then(data=>{
      console.log(data);
      data.forEach(item => {
        this.stepsArray.push({date: item.startDate.toISOString(), count: item.value})
      });
      if(this.stepsArray.length){
        this.hasData = true
      }
    }).catch(e => {
      console.log("error "+ e);
    })
  }

  getAggregatedSteps(){
    this.health.queryAggregated({
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // ten days ago
      endDate: new Date(), // now
      dataType: 'steps',
      bucket: 'week'
    }).then(data=>{
      console.log(data);
      data.forEach(item => {
          this.stepsAggregated.push({start: item.startDate, end: item.endDate, count: item.value})
      });
    }).catch(e => {
      console.log("error "+ e);
    })
  }
}
