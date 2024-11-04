import { BadRequestError } from '@trg_package/errors';
import { ReportInsert, ReportSelect } from '@trg_package/schemas-reporting/types';
import { NextFunction, Request, Response } from 'express';

export const validateReport = (
  req : Request<Pick<ReportSelect,'id'>, object, ReportInsert>,
  res : Response,
  next : NextFunction
) => {
  const {
    columns,
    groupBy,
    filters,
    tables,
    conditions
  } = req.body;

  const groupBySet = new Set(groupBy?.map((gb) => gb.column.id));
  const hasOperation = columns?.some((col) => col.operation);

  if (hasOperation && groupBySet.size == 0) {
    throw new BadRequestError('Report requires a group by in order to aggreate the columns');
  }

  columns?.forEach((col) => {
    const isInGroupBy = groupBySet.has(col.column.id);
    const matchingFilter = filters?.find((f) => f.column.id === col.column.id);
    const hasOperationDefined = !!col.operation;

    // Rule 1: If a column has an operation, it cannot be present in groupBy
    if (hasOperationDefined && isInGroupBy) {
      throw new BadRequestError(`Column ${col.column.heading} has an operation, so it cannot be in group by`);
    }

    // Combined Rule (Rules 2 and 3):
    // If groupBy is non-empty or any column has an operation, each column
    // must either have an operation or be in groupBy
    if ((groupBySet.size > 0 || hasOperation) && !hasOperationDefined && !isInGroupBy) {
      throw new BadRequestError(`Column ${col.column.heading} must have an operation, or be part of group by`);
    }

    if (hasOperationDefined && matchingFilter) {
      matchingFilter.columnName = `${col.operation}(${col.column.tablealias}."${col.column.name}")`;
      matchingFilter.conditionType = 'having';
    }
  });

  filters?.forEach((filter) => {
    if (!tables?.find((e) => e === filter.column.tablealias)) {
      tables?.push(filter.column.tablealias);
    }
  });
  conditions?.forEach((condition) => {
    if (!tables?.find((e) => e === condition.column.tablealias)) {
      tables?.push(condition.column.tablealias);
    }
  });
  groupBy?.forEach((gb) => {
    if (!tables?.find((e) => e === gb.column.tablealias)) {
      tables?.push(gb.column.tablealias);
    }
  });
  next();
};
