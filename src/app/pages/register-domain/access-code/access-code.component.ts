import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ValidateAccessCode } from '@app/core/guards/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-access-code',
  templateUrl: './access-code.component.html',
  styleUrl: './access-code.component.scss'
})
export class AccessCodeComponent implements OnInit, AfterViewInit {
  loading = false;

  email!: string;
  domain!: string;

  accessCode!: string;
  accessCodeDigits: string[] = Array(6).fill('');
  showTimer = false;
  awaitingAccessCode = false;
  timer = 300;
  timerInterval: any;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeEmailFromState();
    this.initializeTimer();
  }

  ngAfterViewInit(): void {
    this.focusFirstInput();
  }

  private initializeEmailFromState(): void {
    const state = window.history.state as { email?: string; domain?: string };
    this.email = state?.email || '';
    this.domain = state?.domain || '';
  }

  private initializeTimer(): void {
    const initialState = localStorage.getItem('accessCodeInitialState');
    if (initialState) {
      this.startTimer();
      localStorage.removeItem('accessCodeInitialState');
    } else {
      const expirationTime = this.getExpirationTimeFromLocalStorage();
      if (expirationTime) {
        this.timer = Math.floor((expirationTime - Date.now()) / 1000);
        if (this.timer > 0) {
          this.startTimer();
        } else {
          this.resend();
        }
      }
    }
  }

  private getExpirationTimeFromLocalStorage(): number | null {
    const expirationTime = localStorage.getItem('expirationTime');
    return expirationTime ? parseInt(expirationTime) : null;
  }

  private setExpirationTimeInLocalStorage(expirationTime: number): void {
    localStorage.setItem('expirationTime', expirationTime.toString());
  }

  startTimer(): void {
    this.showTimer = true;
    const expirationTime = Date.now() + this.timer * 1000;
    this.setExpirationTimeInLocalStorage(expirationTime);

    this.timerInterval = setInterval(async () => {
      const timeLeft = expirationTime - Date.now();
      if (timeLeft > 0) {
        this.timer = Math.floor(timeLeft / 1000);
      } else {
        this.stopTimer();
        await this.resend();
      }
    }, 1000);
  }

  stopTimer(showTimer = false): void {
    this.showTimer = showTimer;
    clearInterval(this.timerInterval);
    this.timerInterval = undefined;
    localStorage.removeItem('expirationTime');
  }

  get formattedTimer(): string {
    return `${this.padZero(Math.floor(this.timer / 60))}:${this.padZero(this.timer % 60)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  private focusFirstInput(): void {
    setTimeout(() => {
      const firstInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      firstInput?.focus();
      firstInput?.select();
    }, 0);
  }

  async moveFocus(index: number, event: KeyboardEvent): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    this.accessCodeDigits[index] = inputElement.value;

    if (inputElement.value.length > 0) {
      if (index === this.accessCodeDigits.length - 1) {
        await this.validate();
      } else {
        this.focusNextInput(index);
      }
    } else if (index > 0) {
      this.focusPreviousInput(index);
    }
  }

  private focusNextInput(index: number): void {
    const nextInput = document.querySelectorAll('input[type="text"]')[index + 1] as HTMLInputElement;
    nextInput?.focus();
  }

  private focusPreviousInput(index: number): void {
    const prevInput = document.querySelectorAll('input[type="text"]')[index - 1] as HTMLInputElement;
    prevInput?.focus();
  }

  selectAllText(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  validateInput(event: KeyboardEvent): void {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  clearInputs(): void {
    this.accessCodeDigits.fill('');
  }

  async resend(): Promise<void> {
    this.stopTimer(true);
    this.awaitingAccessCode = true;
    this.authService.resendAccessCode(this.email).subscribe({
      next: async (response: any) => {
        this.onResendSuccess(response.message);
      },
      error: async () => {
        this.onResendError();
      }
    });
  }

  private onResendSuccess(message: string): void {
    this.loading = false;
    this.awaitingAccessCode = false;
    this.clearInputs();
    this.focusFirstInput();
    this.resetTimer();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  private onResendError(): void {
    this.loading = false;
    this.awaitingAccessCode = false;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while getting the access code.' });
  }

  private resetTimer(): void {
    this.timer = 300;
    this.startTimer();
  }

  async validate(): Promise<void> {
    this.loading = true;
    this.accessCode = this.accessCodeDigits.join('');
    this.authService.validateAccessCode(this.email, this.accessCode).subscribe({
      next: async (response: ValidateAccessCode) => {
        await this.onValidateSuccess(response);
      },
      error: async () => {
        await this.onValidateError();
      }
    });
  }

  private async onValidateSuccess(response: ValidateAccessCode): Promise<void> {
    this.loading = false;
    if (!response.error) {
      this.handleSuccessfulValidation(response.message);
    } else {
      this.handleFailedValidation(response.message);
    }
  }

  private handleSuccessfulValidation(message: string): void {
    this.stopTimer();
    localStorage.removeItem('accessCodeInitialState');
    this.clearInputs();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    this.focusFirstInput();
    this.goTo('/domain', { email: this.email, domain: this.domain });
  }

  private handleFailedValidation(message: string): void {
    this.clearInputs();
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message || 'Validation failed.' });
    this.focusFirstInput();
  }

  private async onValidateError(): Promise<void> {
    this.loading = false;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while validating the access code.' });
  }

  async goTo(url: string, state?: any): Promise<void> {
    this.stopTimer();
    localStorage.removeItem('accessCodeInitialState');
    this.clearInputs();
    if (state) {
      await this.router.navigate([url], { state });
    } else {
      await this.router.navigate([url]);
    }
  }
}
