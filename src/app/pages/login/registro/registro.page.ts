import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  form: FormGroup;
  errorCode?: string;
  hasError: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: Auth
  ) {
    this.form = this.createForm();
  }

  ngOnInit() {}

  createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async irLogin() {
    await SplashScreen.show({
      showDuration: 1000,
      autoHide: true,
    });
    this.router.navigate(['/login']);
  }

  async registro() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    const singIn = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    )
      .then((e) => {
        console.log(e.user);
        SplashScreen.show({
          showDuration: 2000,
          autoHide: true,
        });
        this.router.navigate(['/home']);
      })
      .catch((e) => {
        this.hasError = true;
        setTimeout(() => {
          this.hasError = false;
        }, 3000);
        this.hasError = true;
        this.errorCode = e.code;
      });
  }
}
