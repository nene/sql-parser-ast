export * from "./ast/Node";
import { ParserOptions, parse as parseCst } from "sql-parser-cst";
import { Program } from "./ast/Node";
import { cstToAst } from "./cstToAst";

/**
 * Parses SQL into Abstract Syntax Tree (AST).
 */
export function parse(sql: string, options: ParserOptions): Program {
  return cstToAst(parseCst(sql, options));
}
