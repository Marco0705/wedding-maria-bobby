import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  protected translate = inject(TranslationService);

  private SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzpLK1RLl-zN0ZyF_a13gDjWGXpH5U0O36yNK8sIuf1SGMcda6fX8_kSAlKB8zOmkfv/exec'; // reemplaza con tu script

  ngOnInit(): void {
    this.createForm();
    this.handleFormChanges();
  }

  createForm() {
    this.form = new FormGroup({
      asistencia: new FormControl('', Validators.required),
      nombreCompleto: new FormControl('', Validators.required),
      invitadoSiNo: new FormControl(''),
      nombreInvitado: new FormControl(''),
      alergias: new FormControl(''),
    });
  }

  handleFormChanges() {
    this.form.get('invitadoSiNo')?.valueChanges.subscribe((value) => {
      const control = this.form.get('nombreInvitado');
      if (value === 'Sí') {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
        control?.setValue('');
      }
      control?.updateValueAndValidity();
    });

    this.form.get('asistencia')?.valueChanges.subscribe((value) => {
      const control = this.form.get('nombreCompleto');
      if (value === 'Sí') {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
        control?.setValue('');
      }
      control?.updateValueAndValidity();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.errors && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field && field.errors && field.touched && field.errors['required']) {
      switch (fieldName) {
        case 'nombreCompleto':
          return this.translate.instant('confirmation.errors.fullName');
        case 'nombreInvitado':
          return this.translate.instant('confirmation.errors.guestName');
        case 'asistencia':
          return this.translate.instant('confirmation.errors.attendance');
        default:
          return this.translate.instant('confirmation.errors.required');
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.sendForm(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private sendForm(data: any) {
    this.isSubmitting = true;

    const preparedData: any = {};
    Object.keys(data).forEach((key) => {
      preparedData[key] = data[key]?.trim() || 'No';
    });

    this.http
      .post<{
        status: string;
        message: string;
      }>(this.SCRIPT_URL, preparedData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res?.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: this.translate.instant('confirmation.swal.successTitle'),
              text: this.translate.instant('confirmation.swal.successText'),
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
            this.form.reset();
          } else {
            this.showError();
          }
        },
        error: (err) => {
          console.error('HTTP Error:', err);
          this.isSubmitting = false;
          // Si es localhost y falla CORS, mostramos mensaje genérico
          this.showError(true);
        },
      });
  }

  private showError(isLocalhost: boolean = false) {
    Swal.fire({
      icon: 'error',
      title: this.translate.instant('confirmation.swal.errorTitle'),
      text: isLocalhost
        ? this.translate.instant('confirmation.swal.errorTextLocalhost')
        : this.translate.instant('confirmation.swal.errorText'),
    });
  }
}
