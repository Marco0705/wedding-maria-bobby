import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  imports: [CommonModule],
  template: `
    <div class="text-4xl md:text-6xl font-mono">
      {{ days }}:{{ hours | number : '2.0' }}:{{ minutes | number : '2.0' }}:{{
        seconds | number : '2.0'
      }}
    </div>
    <div class="text-sm md:text-base mt-2 flex justify-center gap-4">
      <span>DAYS</span>
      <span>HOURS</span>
      <span>MINUTES</span>
      <span>SECONDS</span>
    </div>
  `,
})
export class CountdownTimerComponent implements OnInit {
  @Input() targetDate!: Date;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  private intervalId: any;

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateTime() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance <= 0) {
      this.days = this.hours = this.minutes = this.seconds = 0;
      clearInterval(this.intervalId);
      return;
    }

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((distance / (1000 * 60)) % 60);
    this.seconds = Math.floor((distance / 1000) % 60);
  }
}
