export * from "./ast/Node";
import { ParserOptions, parse } from "sql-parser-cst";
import { Program } from "./ast/Node";
import { cstToAst } from "./cstToAst";

/**
 * Parses SQL into Abstract Syntax Tree (AST).
 */
export function parseAst(sql: string, options: ParserOptions): Program {
  return cstToAst(parse(sql, options));
}
