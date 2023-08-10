import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service router;

  @tracked clientNumber;
  @tracked pin;
  @tracked dobDay;
  @tracked dobMonth;
  @tracked dobYear;
  @tracked rememberMe;

  // Validation??
  @action login() {
    this.router.transitionTo('dashboard');
  }
}
