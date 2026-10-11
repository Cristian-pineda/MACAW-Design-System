// Templates: structure with placeholder content and slot props.
export { ListTemplate, type ListTemplateProps } from './list-template/list-template.tsx';
export {
  RecordSummary,
  RecordTemplate,
  type RecordSummaryItem,
  type RecordSummaryProps,
  type RecordTemplateProps,
} from './record-template/record-template.tsx';
export {
  DashboardTemplate,
  type DashboardKpi,
  type DashboardTemplateProps,
} from './dashboard-template/dashboard-template.tsx';
export {
  SettingsTemplate,
  type SettingsField,
  type SettingsSection,
  type SettingsTemplateProps,
} from './settings-template/settings-template.tsx';

// Pages: templates filled with realistic content.
export { BillingDashboard } from './billing-dashboard/billing-dashboard.tsx';
export { InvoiceRecord } from './invoice-record/invoice-record.tsx';
export { AccountSettings } from './account-settings/account-settings.tsx';
