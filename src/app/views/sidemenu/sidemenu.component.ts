import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent {

  links: { name: string, link: string }[] = [

    { name: 'Synthesizer', link: 'https://fluqz.github.io/Synthesizer/' },
    { name: 'Audio World', link: 'https://fluqz.github.io/audio-world/' },
    { name: 'Maze 3D', link: 'https://fluqz.github.io/maze-3D/' },
    { name: 'Game Of Life 3D', link: 'https://fluqz.github.io/game-of-life-3D/' },
    { name: 'Theremin 3D', link: 'https://fluqz.github.io/Etherphone3D/' },
    { name: 'Mandelbrot Set', link: 'https://fluqz.github.io/MandelbrotSet3D/' },
    
  ]

  @HostBinding('class.active') public active: boolean = false
      

  toggle(a: boolean) {

    if(a == undefined) this.active = !this.active
    else this.active = a
  }

  open() {

    console.log('open')
    this.active = true
  }
  close() {

    console.log('close')
    this.active = false
  }
}
