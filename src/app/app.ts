import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {translations} from './translations';
import {supabase} from './supabase';

type Lang = 'pt' | 'en' | 'fr';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private fb = inject(FormBuilder);

  lang = signal<Lang>('pt');
  t = computed(() => translations[this.lang()]);

  reservationForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    guests: [2, [Validators.required, Validators.min(1)]],
    requests: ['']
  });

  isMobileMenuOpen = false;
  reservationSuccess = false;
  isSubmitting = false;
  reservationError = false;

  menuItems = computed(() => {
    const items = this.t().highlights.items;
    return [
      { ...items[0], image: 'https://picsum.photos/seed/espetada/400/300' },
      { ...items[1], image: 'https://picsum.photos/seed/poncha/400/300' },
      { ...items[2], image: 'https://picsum.photos/seed/bolodocaco/400/300' },
      { ...items[3], image: 'https://picsum.photos/seed/milhofrito/400/300' },
    ];
  });

  reviews = computed(() => this.t().reviews.items);

  setLang(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.lang.set(select.value as Lang);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  async submitReservation() {
    if (this.reservationForm.valid) {
      this.isSubmitting = true;
      this.reservationError = false;
      
      try {
        const { error } = await supabase
          .from('reservations')
          .insert([this.reservationForm.value]);

        if (error) throw error;

        console.log('Reservation submitted:', this.reservationForm.value);
        this.reservationSuccess = true;
        this.reservationForm.reset({ guests: 2 });
      } catch (error) {
        console.error('Error submitting reservation:', error);
        this.reservationError = true;
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.reservationForm.markAllAsTouched();
    }
  }

  resetReservation() {
    this.reservationSuccess = false;
    this.reservationError = false;
  }
}
