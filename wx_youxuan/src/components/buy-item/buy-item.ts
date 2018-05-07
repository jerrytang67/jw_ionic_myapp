import { Component, Input } from '@angular/core';
import { InitDataProvider } from '../../providers/providers';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'buy-item',
  templateUrl: 'buy-item.html'
})
export class BuyItemComponent {

  @Input('item') item;
  constructor(
    private initData: InitDataProvider,
    private modalCtrl: ModalController,
  ) {
  }

  goDetail(buyitem) {
    let pagename: string = "";
    switch (buyitem.Type) {
      case 1:
        pagename = "ItemDetailPage";
        break;
      case 11:
        pagename = "MuJuanPage";
        break;
      case 3:
        pagename = "KanjiaPage";
        break;
    }
    let modal = this.modalCtrl.create(pagename, { DetailId: buyitem.Id, Self: true });

    modal.onDidDismiss(() => {
      this.initData.initDefaultShare();
    });
    modal.present();
  }

  get btnText() {
    if (this.item.Count === 0)
      return { text: "已售完", color: "disable" };
    if (new Date(this.item.DateTimeEnd) < new Date())
      return { text: "已结束", color: "disable" }
    return { text: "立即购买", color: "primary" }
  }

  get showPrice() {
    if (this.item.Type === 11)
      return false;
    return true;
  }
}