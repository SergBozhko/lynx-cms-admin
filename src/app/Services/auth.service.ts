import {Injectable} from '@angular/core';
import {LynxService} from "./lynx.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {LynxLoggingService} from "./lynx-logging.service";
import {LynxLoginService} from "./lynx-login.service";

@Injectable()
export class AuthService {

  constructor(private lynxService: LynxService,
              private router: Router,
              private logInService: LynxLoginService) {
  }

  /**
   * Главный LogIn обработчик
   * @param login {String} Логин
   * @param password {String} Пароль
   * @returns {Observable<any>}
   * @constructor
   */
  public Login(login: string, password: string): any {
    return this.lynxService.Post("/Account/Login", {
      email: login,
      password: password
    });
  }

  /**
   * Главный LogOut обработчик
   * @constructor
   */
  public Logout(): void {

    this.lynxService.Get('/Account/LogOut').subscribe(
      () => {
        this.logInService.DestroyAuthData();
        this.router.navigate(['/auth']);
        LynxLoggingService.Log('Выход из аккаунта');
      },

      error => LynxLoggingService.Log('Ошибка LogOut ', error)
    );
  }

  /**
   * Проверка авторизации
   * @constructor
   */
  public CheckAuth(): void {
    this.getUserInfo()
      .subscribe(
        res => {
          LynxLoggingService.Log('Пользователь авторизован');
        },
        () => {
          this.router.navigate(['/auth']);
          LynxLoggingService.Error('Пользователь не авторизован');
        }
      );
  }

  /**
   * Получение информации о пользователе
   * @returns {Observable<any>}
   * * @constructor
   */
  public getUserInfo(): Observable<any> {
    return this.lynxService.Get('/Account/CheckAuth');
  }
}
