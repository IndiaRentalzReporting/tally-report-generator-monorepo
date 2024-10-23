import { DetailedColumnSelect } from '../types';
import { FilterTypes } from './filterTypes';

/**
 * Used by user to filter reports when report is running or viewed
 * These data filters will be picked by user after report is generated
 */
export type ReportFilterInsert = {
  column: DetailedColumnSelect,
  filterType : FilterTypes
};

export type ReportFilterSelect = {
  column : DetailedColumnSelect,
  filterType : FilterTypes
};

export type ReportFilterConfig = {
  [K : DetailedColumnSelect['alias']] : {
    filterType : FilterTypes,
    dataSource : string | null,
    heading : DetailedColumnSelect['heading']
    queryCondition : string
  }
};
