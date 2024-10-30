import z from 'zod';
import { ConditionOperations } from '@trg_package/schemas-reporting/types';
import { DetailedColumnInsertSchema } from './column';

// Helper function to convert param type to Zod schema
const getParamSchema = (paramType: any): z.ZodType => {
  if (paramType === 'string') {
    return z.string().min(1);
  } if (Array.isArray(paramType)) {
    return z.array(getParamSchema(paramType[0]));
  }
  return z.string().min(1); // default fallback
};

// Helper function to create params schema from operation config
const createParamsSchema = (params: any) => {
  if (params === null) {
    return z.undefined();
  }

  const schemaObj: Record<string, z.ZodType> = {};
  Object.entries(params).forEach(([key, type]) => {
    schemaObj[key] = getParamSchema(type);
  });
  return z.object(schemaObj).strict();
};

// Create the dynamic schema
const createConditionSchema = () => {
  // Define base fields
  const baseFields = {
    join: z.enum(['AND','OR','AND NOT','OR NOT']).or(z.undefined()),
    column: DetailedColumnInsertSchema
  };

  // Create individual schemas for each operator
  const operatorSchemas = Object.entries(ConditionOperations).map(([operator, config]) => z.object({
    ...baseFields,
    operator: z.literal(operator),
    params: createParamsSchema(config.params)
  }));

  // Create the discriminated union
  const ReportConditionInsertSchema = z.discriminatedUnion('operator', operatorSchemas as [any,...any[]]);

  // Create the operator enum

  return ReportConditionInsertSchema;
};

export const ReportConditionInsertSchema = createConditionSchema();
