import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { defer } from "rxjs/observable/defer";
import { fromPromise } from 'rxjs/observable/fromPromise';

import { catchError, concat, map, tap } from "rxjs/operators";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/withLatestFrom';

import * as  CacheAction from "../actions/cache.action";
import { AppState } from "../../app/app.state";
import { Action, Store } from "@ngrx/store";
import { AppService } from "../../services/appService";
import { UiProvider } from "../../providers/ui/ui";
@Injectable()
export class CacheEffects {
    constructor(private actions$: Actions,
        private store$: Store<AppState>,
        private appService: AppService,
        private UI: UiProvider
    ) {
    }

    @Effect()
    init$ = defer(() => fromPromise(this.appService.getInit())
        .pipe(
            map((res: any) => {
                return new CacheAction.Init(res);
            }), //next
            catchError((error) => this.createErrorObservableAndLog(error)), //error
        //concat(Observable.of(new CacheAction.Init())) //complate
    ));


    @Effect()
    loadShopOrders$: Observable<Action> = this.actions$
        .ofType<CacheAction.LoadShopOrders>(CacheAction.LOADSHOPORDERS)
        .switchMap((action: any) => this.appService.getShopOrders(action.payload)).pipe(
            map((res: any) => {
                if (res.success) {
                    return new CacheAction.LoadShopOrdersSuccess(res.data);
                }
                else {
                    return new CacheAction.LoadError(res.msg)
                }
            }),
            catchError((error) => this.createErrorObservableAndLog(error))
        );

    @Effect()
    loadSubjectList$: Observable<Action> = this.actions$
        .ofType<CacheAction.LoadSubjectList>(CacheAction.LOADSUBJECTLIST)
        .switchMap((action: any) => this.appService.getSubjectList(action.payload)).pipe(
            map((res: any) => {
                if (res.success) {
                    //return new CacheAction.LoadError("error")
                    //this.UI.showToast(res.success)
                    return new CacheAction.LoadSubjectListSuccess(res.data);
                }
                else {
                    //this.UI.showToast(res.msg);
                    return new CacheAction.LoadError(res.msg)
                }
            }),
            catchError((error) => this.createErrorObservableAndLog(error))
        );

    //专题页面
    @Effect()
    loadSubject$: Observable<Action> = this.actions$
        .ofType<CacheAction.LoadSubject>(CacheAction.LOADSUBJECT)
        .switchMap((action: any) => {
            console.log(action.payload);
            return this.appService.getSubject(action.payload);
        }).pipe(
            map((res: any) => {
                if (res.success) {
                    //return new CacheAction.LoadError("error")
                    //this.UI.showToast(res.success)
                    return new CacheAction.LoadSubjectSuccess(res.data);
                }
                else {
                    //this.UI.showToast(res.msg);
                    return new CacheAction.LoadError(res.msg)
                }
            }),
            catchError((error) => this.createErrorObservableAndLog(error))
        );

    @Effect()
    loadBuyItemList$: Observable<Action> = this.actions$
        .ofType<CacheAction.LoadBuyItemList>(CacheAction.LOADBUYITEMLIST)
        .switchMap((action: any) => {
            return this.appService.getBuyItemList(action.payload);
        }).pipe(
            map((res: any) => {
                if (res.success) {
                    console.log(res.data);
                    return new CacheAction.LoadBuyItemListSuccess(res.data);
                }
                else {
                    return new CacheAction.LoadError(res.msg)
                }
            })
        );

    @Effect()
    loadSetting$: Observable<Action> = this.actions$
        .ofType<CacheAction.LoadSetting>(CacheAction.LOADSETTING)
        .switchMap(action => this.appService.loadSetting())
        .pipe(
            map((res: any) => {
                console.log(res);
                if (res.success) {
                    //return new CacheAction.LoadError("error")
                    //this.UI.showToast(res.success)
                    return new CacheAction.LoadSettingSuccess(res.data);
                }
                else {
                    return new CacheAction.LoadError(res.msg)
                }
            }),
            catchError((error) => this.createErrorObservableAndLog(error))

        );

    @Effect({ dispatch: false })
    loadError$: Observable<any> = this.actions$
        .ofType<CacheAction.LoadError>(CacheAction.LOADERROR)
        .pipe(
            map(action => action.payload),
            tap(payload => this.UI.showToast(payload))
        );

    private createErrorObservableAndLog(error) {
        // this.UI.showToast(error);
        return Observable.of(new CacheAction.LoadError(error));
    }

}