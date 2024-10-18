import { DetailedColumnSelect } from '../types';

/**
 * Used by user to filter reports when report is running or viewed
 * These data filters will be picked by user after report is generated
 */
export type ReportFilterInsert = {
  column: DetailedColumnSelect;
  filterType: 'search' | 'select' | 'range';
};

export type ReportFilterSelect = {
  column: DetailedColumnSelect;
  filterType: 'search' | 'select' | 'range';
};
