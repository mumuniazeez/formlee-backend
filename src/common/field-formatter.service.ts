import { Injectable } from '@nestjs/common';

export interface EmailField {
  label: string;
  value: string;
}

@Injectable()
export class FieldFormatterService {
  private readonly excludesKeys = new Set([
    '_honeypot',
    '_gotcha',
    '_next',
    '_redirect',
    '_subject',
    '_cc',
    '_replyto',
    'g-recaptcha-response',
    'cf-turnstile-response',
  ]);

  format(payload: Record<string, unknown>): EmailField[] {
    return Object.entries(payload)
      .filter(([key]) => !this.isExcluded(key))
      .map(([key, value]) => ({
        label: key,
        value: this.toDisplayValue(value),
      }));
  }

  isExcluded(key: string): boolean {
    return this.excludesKeys.has(key) || key.startsWith('_');
  }

  private toDisplayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (Array.isArray(value)) {
      return value.map((v) => this.toDisplayValue(v)).join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(value);
  }
}
