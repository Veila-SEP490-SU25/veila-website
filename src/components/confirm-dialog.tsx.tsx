'use client';

import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  children: ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-blue-500',
    confirmVariant: 'default' as const,
  },
  destructive: {
    icon: XCircle,
    iconColor: 'text-red-500',
    confirmVariant: 'destructive' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    confirmVariant: 'default' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    confirmVariant: 'default' as const,
  },
};

export function ConfirmDialog({
  children,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  disabled = false,
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Confirm action failed:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Convenience wrapper components for common use cases
export function DeleteConfirmDialog({
  children,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  loading = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}) {
  return (
    <ConfirmDialog
      variant="destructive"
      title={title}
      description={description}
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={onConfirm}
      loading={loading}
    >
      {children}
    </ConfirmDialog>
  );
}

export function SaveConfirmDialog({
  children,
  title = 'Save Changes',
  description = 'Are you sure you want to save these changes?',
  onConfirm,
  loading = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}) {
  return (
    <ConfirmDialog
      variant="success"
      title={title}
      description={description}
      confirmText="Save"
      cancelText="Cancel"
      onConfirm={onConfirm}
      loading={loading}
    >
      {children}
    </ConfirmDialog>
  );
}

export function WarningConfirmDialog({
  children,
  title = 'Warning',
  description = 'This action may have unintended consequences. Are you sure you want to continue?',
  onConfirm,
  loading = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}) {
  return (
    <ConfirmDialog
      variant="warning"
      title={title}
      description={description}
      confirmText="Continue"
      cancelText="Cancel"
      onConfirm={onConfirm}
      loading={loading}
    >
      {children}
    </ConfirmDialog>
  );
}
