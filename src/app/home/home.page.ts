import { Component } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion, OrientationListenerEvent } from '@capacitor/motion';
import { async } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { CapacitorFlash } from '@capgo/capacitor-flash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  toggleValue: boolean = false;
  accelHandler?: PluginListenerHandle;
  orientacion?: OrientationListenerEvent;
  x?: any;
  y?: any;
  z?: any;
  audioD?: HTMLAudioElement;
  audioI?: HTMLAudioElement;
  audioV?: HTMLAudioElement;
  audioH?: HTMLAudioElement;

  constructor() {
    this.audioD = new Audio();
    this.audioI = new Audio();
    this.audioV = new Audio();
    this.audioH = new Audio();
  }

  ngOnInit() {}

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
      if (this.accelHandler) {
        this.accelHandler.remove;
      }
    }
  }
}
