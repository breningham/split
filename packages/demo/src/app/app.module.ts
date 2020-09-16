import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { SplitCoreModule } from '@inghamdev/split/src/lib/split-core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SplitCoreModule.forRoot({
      core: {
        authorizationKey: 'g2gmlioddemtb4351hjcur7enj2d7fb961hl',
        key: 'CUSTOMER_ID',
        labelsEnabled: true,
        trafficType: 'users',
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
