import { type ReportInsert } from "./Report"
export {
    type ReportInsert,
    ReportInsertSchema,
    type ReportSelect,
    ReportSelectSchema
} from "../schemas/report"


//Shape of report while fetching 
export type ReportFetchSchema = Pick<ReportInsert, "id" | "name" | "queryConfig">