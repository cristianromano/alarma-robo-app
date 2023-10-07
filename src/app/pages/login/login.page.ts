import { Component, Injectable, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { SplashScreen } from '@capacitor/splash-screen';
import { collection, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  form: FormGroup;
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

  async irRegistro() {
    await SplashScreen.show({
      showDuration: 1000,
      autoHide: true,
    });
    this.router.navigate(['/registro']);
  }

  async login() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    const singIn = await signInWithEmailAndPassword(this.auth, email, password)
      .then((e) => {
        console.log(e.user);
        SplashScreen.show({
          showDuration: 2000,
          autoHide: true,
        });
        this.router.navigate(['/home']);
      })
      .catch((e) => {
        console.log(e.code);
      });
  }

  async singAdmin() {
    await signInWithEmailAndPassword(this.auth, 'admin@admin.com', '111111');
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
    this.router.navigate(['/home']);
  }

  async singUser() {
    await signInWithEmailAndPassword(
      this.auth,
      'invitado@invitado.com',
      '222222'
    );
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
    this.router.navigate(['/home']);
  }

  async singInvitado() {
    await signInWithEmailAndPassword(
      this.auth,
      'usuario@usuario.com',
      '333333'
    );
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
    this.router.navigate(['/home']);
  }

  async singAnonimo() {
    await signInWithEmailAndPassword(
      this.auth,
      'anonimo@anonimo.com',
      '444444'
    );
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
    this.router.navigate(['/home']);
  }

  async singTester() {
    await signInWithEmailAndPassword(this.auth, 'tester@tester.com', '555555');
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
    this.router.navigate(['/home']);
  }
}
