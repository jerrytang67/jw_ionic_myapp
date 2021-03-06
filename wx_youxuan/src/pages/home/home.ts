import {
  Component, ViewChild,
  trigger, transition, animate, style, state
} from '@angular/core';
import { NavController, Slides, IonicPage, ModalController } from 'ionic-angular';
import { Settings, InitDataProvider } from '../../providers/providers';
import { Api } from '../../providers/api/api';
import { Observable } from 'rxjs/Observable';
import { CacheState, getStore } from '../../store/state/cache.State';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.state';

import * as CacheActions from "../../store/actions/cache.action";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cache$: Observable<CacheState>;

  @ViewChild(Slides) slides: Slides;
  constructor(
    public navCtrl: NavController,
    private api: Api,
    private initData: InitDataProvider,
    private modalCtrl: ModalController,
    private store: Store<AppState>) {
    // settings.load().then(() => {
    //   // console.log(settings.settings);
    // });
    this.cache$ = this.store.select(z => z.cache);
  }

  ionViewDidLoad() {
    this.api.visitLog({ page: 'HomePage' });
  }

  type: any;
  BuyList: any = [];
  slideList: any = [];

  slideClick(s) {
    // if (/^http/i.test(s.Url))
    //   window.location.href = s.Url;
    // else if (/^\//.test(s.Url)) {
    //   console.log(s);
    window.location.href = s.Url;
    // }
  }
  // checkFavorate(item) {
  //   if (!item.Favorate)
  //     return "heart-outline";
  //   else
  //     return "heart"
  // }
  goList(iid) {
    this.navCtrl.push("ListPage", { iid });
  }

  listSkip = 0;
  listNum = 10;

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.listSkip = this.listSkip + this.listNum;
      this.store.dispatch(new CacheActions.LoadBuyItemList({ num: this.listNum, skip: this.listSkip }));
      infiniteScroll.complete();
    }, 500);
  }

  // clickFavorate(item) {
  //   this.api.addFavorate(item).then(res => {
  //     console.log(res);
  //     item.Favorate = res.State;
  //     this.api.showToast((item.Favorate ? "收藏成功" : "取消收藏") + " " + item.Name, 1000, "middle");
  //   }).catch(err => {
  //     this.api.showToast(JSON.stringify(err), 5000, "bottom");
  //   });
  // }


  // hScroll: any = [
  //   { name: '活动进行中', selected: true },
  //   { name: '活动预告', selected: false },
  //   { name: '大型爱心公益', selected: false },
  //   { name: '中秋', selected: false },
  //   { name: '水果', selected: false }
  // ];
  // showSelected: boolean = false;

  // ngAfterViewInit() {
  // }

  // tapS(s) {
  //   this.hScroll.forEach(element => {
  //     element.selected = false;
  //   });
  //   s.selected = true;
  // }
}
