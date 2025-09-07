'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn('flex items-center gap-3 has-disabled:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center gap-3', className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  type = 'text',
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
  type?: 'text' | 'password';
}) {
  const inputOTPContext = React.useContext(OTPInputContext);

  const slot = inputOTPContext?.slots?.[index];
  const { char, hasFakeCaret, isActive } = slot ?? {};

  // Tách các props không phải DOM props để tránh React warning
  const domProps = { ...props };
  delete (domProps as any).placeholderChar;
  delete (domProps as any).isActive;
  delete (domProps as any).hasFakeCaret;
  delete (domProps as any).char;
  delete (domProps as any).placeholder;
  delete (domProps as any).value;

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || false}
      className={cn(
        'relative flex h-12 w-12 items-center justify-center border-2 border-gray-300 rounded-md text-lg font-medium text-gray-900 bg-white shadow-sm transition-all outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 data-[active=true]:border-rose-500 data-[active=true]:ring-2 data-[active=true]:ring-rose-500/20',
        className,
      )}
      {...domProps}
    >
      <span className={cn('text-gray-900 font-medium', !char && 'text-gray-400')}>
        {type === 'text' ? char || '' : char && char.trim() !== '' ? '•' : ''}
      </span>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
