import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'welcome-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  @Input('isSignupMode') isSignupMode: boolean;
  @Input('isLoginMode') isLoginMode: boolean;

  @Output() changeToSignup = new EventEmitter();
  @Output() changeToLogin = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  OnChangeToSignup() {
    this.changeToSignup.emit();
  }

  onChangeToLogin() {
    this.changeToLogin.emit();
  }

}
