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
      { ...items[0], image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop' },
      { ...items[1], image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop' },
      { ...items[2], image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=400&h=300&fit=crop' },
      { ...items[3], image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop' },
      { ...items[4], image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&h=300&fit=crop' },
      { ...items[5], image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
      { ...items[6], image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop' },
      { ...items[7], image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop' },
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
