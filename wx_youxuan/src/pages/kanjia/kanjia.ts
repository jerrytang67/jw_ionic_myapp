import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { InitDataProvider } from '../../providers/init-data/init-data';
import { Api } from '../../providers/api/api';
import { ModalService } from '../../services/modalService';
import { HttpClient } from '@angular/common/http';
import *  as $ from 'jquery';
import { Observable } from 'rxjs/Observable';
import { KanJiaUser } from '../../store/types/kanJiaUser.Model';
import { AppService } from '../../services/appService';
declare var WeixinJSBridge: any;
declare var wx: any;

@IonicPage({
  segment: "KanJia/:DetailId",
  defaultHistory: ["TabsPage"]
})
@Component({
  selector: 'page-kanjia',
  templateUrl: 'kanjia.html',
})
export class KanjiaPage {
  _id: number;
  _buyItem: any;
  loading: any;
  _count: number = 1;
  alert: any;

  _kanJiaUser: any;
  _kanJiaUsers: any;
  _shareFromOpenid: string = null;
  _leftTime: { days: number, hours: number, minutes: number, seconds: number } = null;
  pet = 'tab2';
  cutPrice = 0;
  helpIndex = 0;

  payUserinfo = { name: "", telphone: "" };

  kanJiaUser$: Observable<KanJiaUser>;

  helperlogourlList: any = [];
  helperqrlogourlList: any = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private initData: InitDataProvider,
    private modalService: ModalService,
    private api: Api,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private appService: AppService
  ) {
    this._id = this.navParams.get("DetailId");
    this.init();
  }

  init() {
    this.api.httpGet("getDetail?itemid=" + this._id).subscribe(res => {
      this._buyItem = res;
      if (!this.navParams.get("Self")) {
        this._shareFromOpenid = this.api.getUriParam("sfrom")
      }

      this.helperlogourlList = JSON.parse(this._buyItem.AdminHelpLogoUrl);
      this.helperqrlogourlList = JSON.parse(this._buyItem.AdminHelpQRLogoUrl);

      //console.log(`_shareFromOpenid:${this._shareFromOpenid}`);
      //获取当前WXUSEr是否已参加

      const wait1 = this.api.getWithAuth(`GetKanJiaUser?buyitemId=${this._id}&openid=${this._shareFromOpenid ? this._shareFromOpenid : this.initData.WxUser.openid}`)
        .then(res => {
          if (res !== null) {
            this._kanJiaUser = res;
            this.pet = 'tab1';
          }
          setTimeout(() => {
            this.initShare(this._buyItem);
          }, 1000);
        })
        .catch(err => alert(err));
      this.getKanJiaUsers();
      this.payUserinfo = { name: this.initData.WxUser.RealName, telphone: this.initData.WxUser.Telphone }
    });
  }

  haibao(index = 0) {
    console.log(index);
    this.selctIdx = index;
    let item = this._buyItem;
    this.haibaoImg = `http://m.wjhaomama.com/home/haibao?buyitemid=${item.Id}&openid=${this.initData.WxUser.openid}&index=${index}`
    this.modalService.open("modalHaibao");
  }
  selctIdx = 0;
  haibaoImg: string = "";
  //下拉刷新事件
  doRefresh(refresher) {
    this.init();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }

  getKanJiaUsers() {
    this.api.getWithAuth(`GetKanJiaUsers?buyitemId=${this._id}`)
      .then(res => {
        //console.log(res);
        if (res !== null) {
          this._kanJiaUsers = res;
        }
      })
      .catch(err => alert(err));
    return;
  }

  fabu() {
    this.navCtrl.push("FabuPage");
  }

  ionViewWillEnter() {
    this.api.visitLog({ page: "KanjiaPage", iid: this._id });

    setInterval(() => {
      if (this._buyItem.DateTimeEnd)
        this._leftTime = this.getRemainTime(this._buyItem.DateTimeEnd);
    }, 1000)
  }

  goShop(shop) {
    // let modal = this.modalCtrl.create("ShopPage", { iid: shop.Id });
    // modal.present();
    this.navCtrl.push("ShopPage", { iid: shop.Id, shop: shop });
  }
  openHelper(index) {
    console.log(index);
    this.helpIndex = index;
    this.modalService.open("modalHelper");
  }

  toHelper() {
    this.modalService.close("modalHelper");
    this.modalService.open("custom-modal-2");
  }
  ionViewWillLeave() {
  }
  ionViewDidLeave() {
  }
  ionViewWillUnload() {
    this.initData.initDefaultShare();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  back() {
    this.navCtrl.pop();
  }

  //计算当前是帮砍还是自己
  getType() {
    let _self = "self";
    let _other = "other";
    if (!this._shareFromOpenid)
      return _self;
    if (!this._kanJiaUser)
      return _self;
    if (this._shareFromOpenid == this.initData.WxUser.openid)
      return _self;
    return _other;
  }

  guanzhu() {
    this.openModal('modalMain');
  }

  //我要砍价
  joinKanJia() {
    this.api.postWithAuthToken("JoinKanJia", { buyItemId: this._id }).then(res => {
      this._kanJiaUser = res;
      this.initShare(this._buyItem);
      this.getKanJiaUsers();
      this.modalService.open("modalCut");
    })
      .catch(err => {
        if (err === 'NeedSubscribe') {
          this.modalService.open("modalMain");
          return;
        }
        this.api.showToast(err, 4000, "bottom")
      });
  }

  goOrder() {
    console.log("goOrder")
    this.navCtrl.push("OrderPage");
  }

  //自己参加
  kanSelf() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create("KanjiaPage", { DetailId: this._id, Self: true });
    modal.present();
  }

  //帮砍按键
  helpKan() {
    this.api.postWithAuthToken("HelpKanJia", { buyItemId: this._id, openid: this._shareFromOpenid })
      .then(res => {
        this._kanJiaUser = res;
        this.modalService.open("modalCut");
        this.getKanJiaUsers();
      })
      .catch(err => {
        if (err === 'NeedSubscribe') {
          this.modalService.open("modalMain");
          return;
        }
        this.api.showToast(err, 3000, "bottom")
      });
  }

  toPay() {
    if (!this._kanJiaUser) {
      this.api.showToast("error:错误的kanjiaUser", 1000, "middle")
      return;
    }
    if (this._kanJiaUser.NowPrice !== this._buyItem.VipPrice) {
      this.api.showToast("请砍至最低价可进行付款", 1000, "middle")
      return;
    }

    this.alert = this.alertCtrl.create({
      title: "正在转至微信支付",
      inputs: [
        {
          name: 'realname',
          placeholder: '联系人',
          value: this.payUserinfo.name
        },
        {
          name: 'telphone',
          placeholder: '手机号',
          value: this.payUserinfo.telphone
        }
      ],
      subTitle: this._buyItem.SuccessText ? this._buyItem.SuccessText : "",
      buttons: [{
        text: '微信支付',
        handler: (data) => {
          if (!/^1(3|4|5|6|7|8|9)[0-9]\d{8}$/i.test(data.telphone)) {
            this.api.showToast("请正确填写手机号", 2000, 'top');
            return false;
          }
          if (!/^.{1,20}$/i.test(data.realname)) {
            this.api.showToast("请正确填写联系人", 2000, 'top');
            return false;
          }
          this.payUserinfo = { name: data.realname, telphone: data.telphone };
          this.http.get<any>(`http://m.wjhaomama.com/TenPayV3/getpay?itemid=${this._buyItem.Id}&count=${this._count}&realname=${data.realname}&telphone=${data.telphone}`
          )
            .subscribe(payRes => {
              if (!payRes.success) {
                this.api.showErrorAlert(payRes.msg);
              }
              else {
                WeixinJSBridge.invoke(
                  'getBrandWCPayRequest', {
                    "appId": payRes.appId,
                    "timeStamp": payRes.timeStamp,
                    "nonceStr": payRes.nonceStr,
                    "package": payRes.package,
                    "signType": payRes.signType,
                    "paySign": payRes.paySign
                  },
                  (wxRes) => {
                    if (wxRes.err_msg == "get_brand_wcpay_request:ok")
                      this.api.showSuccessAlert("支付成功!请尽快至门店验证消费");
                    else if (wxRes.err_msg == "get_brand_wcpay_request:cancel")
                      this.api.showErrorAlert("用户取消支付");
                    else if (wxRes.err_msg == "get_brand_wcpay_request:fail")
                      this.api.showErrorAlert("微信支付失败");
                    this.api.showErrorAlert(wxRes.err_msg);
                  }
                )
              }
            });
        }
      }]
    });
    this.alert.present();
  }

  initShare(buyItem) {
    if (this.initData.WxUser.openid) {
      let title = buyItem.Name;
      if (this._kanJiaUser)
        title = `${this._kanJiaUser.nickname}正在抢购${buyItem.Name}`
      let wxData = {
        title,
        desc: buyItem.ShareDesc,
        imgUrl: buyItem.LogoList[0] + "!w100",
        link: `http://m.wjhaomama.com/?sid=6&sfrom=${this._kanJiaUser ? this._kanJiaUser.openid : this.initData.WxUser.openid}&page=KanjiaPage&iid=${this._id}`
      }
      this.api.wxshare(wxData.title, wxData.desc, wxData.link, wxData.imgUrl);
    }
  }

  getRemainTime = (endTime) => {
    let t = Date.parse(new Date(endTime).toUTCString()) - Date.parse(new Date().toUTCString())
    if (t < 0)
      return null;
    let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    let days = Math.floor(t / (1000 * 60 * 60 * 24))
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    }
  }
}
