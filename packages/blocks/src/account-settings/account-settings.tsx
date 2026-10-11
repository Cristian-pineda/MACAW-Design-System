import { SettingsTemplate, type SettingsSection } from '../settings-template/settings-template.tsx';

const SECTIONS: SettingsSection[] = [
  {
    id: 'business',
    title: 'Business details',
    description: 'Shown on invoices, receipts and your customers’ card statements.',
    fields: [
      {
        id: 'business-legal-name',
        label: 'Legal name',
        defaultValue: 'Perch Analytics, Inc.',
        autoComplete: 'organization',
      },
      {
        id: 'business-display-name',
        label: 'Statement descriptor',
        defaultValue: 'PERCH ANALYTICS',
        hint: 'Up to 22 characters. Customers see this on their card statements.',
      },
      {
        id: 'business-support-email',
        label: 'Support email',
        type: 'email',
        defaultValue: 'billing@perch.test',
        autoComplete: 'email',
      },
      {
        id: 'business-address',
        label: 'Registered address',
        defaultValue: '500 Market Street, Suite 300, San Francisco, CA 94105',
        autoComplete: 'street-address',
      },
    ],
    saveLabel: 'Save details',
  },
  {
    id: 'payout',
    title: 'Payout account',
    description: 'Where your balance is paid out. Changes take effect from the next payout.',
    fields: [
      {
        id: 'payout-account-holder',
        label: 'Account holder',
        defaultValue: 'Perch Analytics, Inc.',
      },
      {
        id: 'payout-account',
        label: 'Bank account',
        defaultValue: 'Chase ···· 4421',
        readOnly: true,
        hint: 'To change the account, verify a new one from the Payouts page.',
      },
      {
        id: 'payout-schedule',
        label: 'Payout schedule',
        defaultValue: 'Weekly, every Tuesday',
      },
      {
        id: 'payout-minimum',
        label: 'Minimum payout (USD)',
        type: 'text',
        defaultValue: '500.00',
        align: 'end',
        startAdornment: '$',
        hint: 'Balances below this amount roll over to the next payout.',
      },
    ],
    saveLabel: 'Save payout account',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Who hears about payments, disputes and overdue invoices.',
    fields: [
      {
        id: 'notifications-billing-email',
        label: 'Billing alerts email',
        type: 'email',
        defaultValue: 'finance@perch.test',
      },
      {
        id: 'notifications-reminder-days',
        label: 'Overdue reminder delay (days)',
        type: 'text',
        defaultValue: '3',
        align: 'end',
        hint: 'Days after the due date. Customers get at most one reminder a week.',
      },
      {
        id: 'notifications-payout-email',
        label: 'Payout receipts email',
        type: 'email',
        defaultValue: 'treasury@perch.test',
      },
    ],
    saveLabel: 'Save notifications',
  },
];

/** Account settings: business details, the payout account and notification recipients. */
export function AccountSettings() {
  return (
    <SettingsTemplate
      title="Account settings"
      description="Business details, payouts and notifications for Perch Analytics."
      sections={SECTIONS}
    />
  );
}
