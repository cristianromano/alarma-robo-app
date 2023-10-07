import { Component, OnInit } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion, OrientationListenerEvent } from '@capacitor/motion';
import { async } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  toggleValue: boolean = false;
  accelHandler?: PluginListenerHandle;
  orientacion?: OrientationListenerEvent;
  showCredentials: boolean = false;
  err?: boolean = false;
  form: FormGroup;
  bandera: boolean = false;
  x?: any;
  y?: any;
  z?: any;
  audioD?: HTMLAudioElement;
  audioI?: HTMLAudioElement;
  audioV?: HTMLAudioElement;
  audioH?: HTMLAudioElement;

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.audioD = new Audio();
    this.audioI = new Audio();
    this.audioV = new Audio();
    this.audioH = new Audio();
    this.form = this.createForm();
  }

  ngOnInit() {}

  createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async start() {
    this.accelHandler = await Motion.addListener(
      'orientation',
      async (event) => {
        this.x = event.beta;
        this.y = event.gamma;
        this.z = event.alpha;

        //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.
        if (this.y > 50 && this.x >= -1 && this.x <= 50) {
          if (this.audioD) {
            this.audioD.src = '../../assets/derecho.mp3';
            await this.audioD?.play();
          }
        }
        //izquierda
        if (this.y <= -50 && this.x >= -1 && this.x <= 50) {
          if (this.audioI) {
            this.audioI.src = '../../assets/izquierdo.mp3';
            await this.audioI?.play();
          }
        }
        //Al ponerlo horizontal, vibrará (por 5 segundos) y al mismo tiempo emitirá otro sonido.
        if (this.x <= -1) {
          await Haptics.vibrate();

          if (this.audioH) {
            this.audioH.src = '../../assets/horizontal.mp3';
            await this.audioH?.play();
          }
        }
        //Al ponerlo vertical, se encenderá la luz (por 5 segundos) y al mismo tiempo emitirá un sonido.
        if (this.x >= 50) {
          if (this.audioV) {
            CapacitorFlash.switchOn({ intensity: 5 });
            CapacitorFlash.toggle;
            this.audioV.src = '../../assets/vertical.mp3';
            await this.audioV?.play();
          }
        }

        if (this.x < 50) {
          if (this.audioV) {
            CapacitorFlash.switchOff();
          }
        }
      }
    );
  }

  activar() {
    if (this.toggleValue == true) {
      this.start();
    } else {
      this.bandera = true;
      this.ingresar();
    }
  }

  valor() {
    this.toggleValue;
  }

  async ingresar() {
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    await signInWithEmailAndPassword(this.auth, email, password)
      .then((e) => {
        if (this.accelHandler) {
          this.accelHandler.remove;
          this.bandera = false;
        }
      })
      .catch((e) => {
        setTimeout(() => {
          this.err = false;
        }, 5000);
        this.err = true;
      });
  }

  LogOut() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
