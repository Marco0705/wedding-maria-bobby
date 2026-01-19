import { Component, HostListener } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { WeddingTimesComponent } from './pages/wedding-times/wedding-times.component';
import { LocationComponent } from './pages/location/location.component';
import { OurStoryComponent } from './pages/our-story/our-story.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { WeddingListComponent } from './pages/wedding-list/wedding-list.component';
import { CommonModule } from '@angular/common';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HomeComponent,
    WeddingTimesComponent,
    LocationComponent,
    OurStoryComponent,
    ConfirmationComponent,
    WeddingListComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'weddingMariaAndBobby';
  activeSection: string = 'inicio';

  constructor(public translation: TranslationService) {
    // Detectar idioma del navegador
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
    this.translation.use(browserLang);
  }

  changeLanguage(lang: string) {
    this.translation.use(lang);
  }

  ngOnInit(): void {
    initFlowbite();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 150) {
        current = section.getAttribute('id')!;
      }
    });

    this.activeSection = current;
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }
}
