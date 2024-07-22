import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

export class AnalyticsManagementModel {
  //
}

export const AnalyticsManagementProvider = getProviderByTypegooseClass(
  AnalyticsManagementModel,
  'analyst_overview',
);
