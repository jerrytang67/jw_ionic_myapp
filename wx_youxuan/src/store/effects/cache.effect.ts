import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import { defer } from "rxjs/observable/defer";
import { fromPromise } from 'rxjs/observable/fromPromise';

import { catchError, concat, map } from "rxjs/operators";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/withLatestFrom';

import * as  CacheAction from "../actions/cache.action";
import { AppState } from "../../app/app.state";
import { Action, Store } from "@ngrx/store";
import { AppService } from "../../services/appService";
@Injectable()
export class CacheEffects {
    constructor(private actions$: Actions,
        private store$: Store<AppState>,
        private appService: AppService
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

    private createErrorObservableAndLog(error) {
        // this.UI.showToast(error);
        return Observable.of(new CacheAction.LoadError(error));
    }
}