import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { timer, Subject, of, Subscription } from 'rxjs';
import { takeWhile, switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-radial-dial',
  templateUrl: './radial-dial.component.html',
  styleUrls: ['./radial-dial.component.scss']
})
export class RadialDialComponent implements OnInit, OnChanges {

  @Input() numerator: number;
  @Input() denominator: number;
  @Output() amount = new EventEmitter();

  @ViewChild('dial', {static: true}) dial: ElementRef;
  @ViewChild('wedge1', {static: true}) wedge1: ElementRef;
  @ViewChild('wedge2', {static: true}) wedge2: ElementRef;
  @ViewChild('point', {static: true}) point: ElementRef;

  nextDial = new Subject<number>();

  initAngle = 0;
  angle = 0;
  minAngle = 0;
  maxAngle = 360;

  quadrent: number; // Defined quadrents that prevent the value from jumping around

  initialDegrees: number;
  radius: number;
  centerX: number;
  centerY: number;

  timer: Subscription;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.initAngle = 0;
    this.angle = 0;
    this.point.nativeElement.style.transform = 'rotate(0deg)';
    this.wedge1.nativeElement.style.transform = 'rotate(180deg)';
    this.wedge2.nativeElement.style.transform = 'rotate(180deg)';

    this.radius = this.dial.nativeElement.offsetWidth / 2;
    const centerXParent = this.dial.nativeElement.offsetParent.offsetParent.offsetLeft;
    const centerYParent = this.dial.nativeElement.offsetParent.offsetParent.offsetTop;
    this.centerX = this.dial.nativeElement.offsetParent.offsetLeft + centerXParent;
    this.centerY = this.dial.nativeElement.offsetParent.offsetTop + centerYParent;

    if (changes.numerator.isFirstChange() === false) {
      const percentage = (this.numerator / this.denominator);
      const countUp = 360 * percentage;
      this.quadrent = 0;
      this.timer = timer(100, 1)
        .pipe(
          takeWhile(value => value <= countUp)
        )
        .subscribe(_ => {
          if (percentage <= 0) {
            this.setAngle(0);
          } else {
            this.setAngle(1);
          }
          this.updateAngle();
        });
    } else if (changes.numerator.isFirstChange()) {
      const percentage = (this.numerator / this.denominator);
      const countUp = 360 * percentage;
      this.quadrent = 0;
      this.timer = timer(100, 1)
        .pipe(
          takeWhile(value => value <= countUp)
        )
        .subscribe(_ => {
          if (percentage <= 0) {
            this.setAngle(0);
          } else {
            this.setAngle(1);
          }
          this.updateAngle();
        });

    }
  }

  getDegrees(event) {
    const radians	= Math.atan2(event.center.x - this.centerX, event.center.y - this.centerY);
    const degrees	= Math.round((radians * (180 / Math.PI) * -1) + 100);
    return degrees;
  }


  onPress(event) {
    this.initialDegrees = this.getDegrees(event);
  }

  updateAmount(event) {
    const degrees = this.getDegrees(event) - this.initialDegrees;
    this.setAngle(degrees);
  }
  setAngle(degrees) {
    const quadcheck = this.initAngle + degrees;
    switch (this.quadrent) {
      // Init point is at quad 0
      case 0:
        if (quadcheck >= 0 && quadcheck < 90) {
          this.angle = quadcheck;
        } else if (quadcheck >= 90 && quadcheck < 180) { // Point is at quad 1 so we should adjust
          this.angle = quadcheck;
          this.quadrent = 1;
        } else {
          this.angle = this.minAngle;
        }
        break;

      // Init point is at quad 0
      case 1:
        // Point is at quad 0 so we should adjust
        if (quadcheck >= 0 && quadcheck < 90) {
          this.angle = quadcheck;
          this.quadrent = 0;
        }
        if (quadcheck >= 90 && quadcheck < 180) {
          this.angle = quadcheck;
        }
        // Point is at quad 2 so we should adjust
        if (quadcheck >= 180 && quadcheck < 270) {
          this.angle = quadcheck;
          this.quadrent = 2;
        }
        break;
      case 2:
        // Point is at quad 1 so we should adjust
        if (quadcheck >= 90 && quadcheck < 180) {
          this.angle = quadcheck;
          this.quadrent = 1;
        }
        if (quadcheck >= 180 && quadcheck < 270) {
          this.angle = quadcheck;
        }
        // Point is at quad 3 so we should adjust
        if (quadcheck >= 270 && quadcheck <= 360) {
          this.angle = quadcheck;
          this.quadrent = 3;
        }
        break;
      case 3:
        // Point is at quad 1 so we should adjust
        if (quadcheck >= 180 && quadcheck < 270) {
          this.angle = quadcheck;
          this.quadrent = 2;
        } else if (quadcheck >= 270 && quadcheck <= 360) {
          this.angle = quadcheck;
        } else {
          this.angle = this.maxAngle;
        }
        break;
    }

    if (this.angle >= 180) {
      this.wedge1.nativeElement.style.transform = 'rotate(0deg)';
      this.wedge2.nativeElement.style.transform = 'rotate(' + this.angle + 'deg)';
    }
    if (this.angle <= 180) {
      this.wedge2.nativeElement.style.transform = 'rotate(180deg)';
      this.wedge1.nativeElement.style.transform = 'rotate(' + (this.angle + 180) + 'deg)';
    }
    if (this.angle >= 0 || this.angle < 360) {
      this.point.nativeElement.style.transform = 'rotate(' + this.angle + 'deg)';
    }

    this.amount.emit((this.angle / 360));
  }

  updateAngle() {
    this.initAngle = this.angle;
  }

}
