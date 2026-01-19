import { Component, inject, OnInit } from '@angular/core';
import { CountdownTimerComponent } from '../../components/countdown-timer/countdown-timer.component';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-wedding-times',
  imports: [CountdownTimerComponent],
  templateUrl: './wedding-times.component.html',
  styleUrls: ['./wedding-times.component.css'],
})
export class WeddingTimesComponent implements OnInit {
  weddingDate = new Date('2026-05-28T19:00:00');

  protected translate = inject(TranslationService);

  ngOnInit() {}
}
