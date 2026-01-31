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
    'https://script.google.com/macros/s/AKfycbzBMkZsMlW79RD7h3citf68BrsWB6xN-1giY85q-x8m6DSiHMDgMtdwrC_6Mu_xDAOY/exec';

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
    // Validación condicional para nombreInvitado
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

    // Solo validar nombreCompleto si asistencia = Sí
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

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
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
    }
    return '';
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.errors && field.touched);
  }

  onSubmit(): void {
    if (this.form.get('asistencia')?.value === 'No') {
      if (this.form.get('asistencia')?.invalid) {
        this.form.get('asistencia')?.markAsTouched();
        return;
      }
      this.sendForm({ asistencia: 'No' });
      return;
    }

    if (this.form.valid) {
      this.sendForm(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  private sendForm(data: any) {
    this.isSubmitting = true;

    // Reemplazar campos vacíos por "No"
    const preparedData: any = {};
    Object.keys(data).forEach((key) => {
      preparedData[key] =
        data[key] && data[key].trim() !== '' ? data[key] : 'No';
    });

    const formData = new FormData();
    Object.keys(preparedData).forEach((key) =>
      formData.append(key, preparedData[key]),
    );

    this.http.post(this.SCRIPT_URL, formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.status === 'success') {
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
          this.errorMessage();
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage();
      },
    });
  }

  private errorMessage() {
    Swal.fire({
      icon: 'error',
      title: this.translate.instant('confirmation.swal.errorTitle'),
      text: this.translate.instant('confirmation.swal.errorText'),
    });
  }
}
