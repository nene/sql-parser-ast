import { DialectName } from "sql-parser-cst";
import { isString } from "../src/utils/generic";

declare const __SQL_DIALECT__: DialectName;

export function dialect(lang: DialectName | DialectName[], block: () => void) {
  lang = isString(lang) ? [lang] : lang;
  if (lang.includes(__SQL_DIALECT__)) {
    describe(__SQL_DIALECT__, block);
  }
}
