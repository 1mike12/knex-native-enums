/**
 * Extracts enum values from the PostgreSQL result, handling differences in result shape
 * between different versions of the pg driver.
 *
 * Pre-version 7 returns the result as an array of rows, while version 7 and later nest
 * rows inside a 'rows' property. This function abstracts that difference so that the rest
 * of the code can reliably work with the enum values.
 */
export function getValuesFromResult(result: any): string[] {
   const isPreVersion7 = !("rows" in result);
   const rows = isPreVersion7 ? result : result.rows;
   const dbValues = rows.map((row: any) => row.value);
   return dbValues as string[];
}
