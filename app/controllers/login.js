import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @tracked clientNumber;
  @tracked pin;

  // Validation??
  @action login() {}
}
