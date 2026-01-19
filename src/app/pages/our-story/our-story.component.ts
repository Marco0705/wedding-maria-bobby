import { Component, inject, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
})
export class OurStoryComponent implements OnInit {
  
  protected translate = inject(TranslationService);

  ngOnInit() {}
}
