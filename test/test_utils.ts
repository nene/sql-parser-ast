import { ParserOptions, DialectName } from "sql-parser-cst";
import { parse as parseAst } from "../src/main";
import { Node, Program } from "../src/ast/Node";
import { astVisitAll } from "../src/astVisitAll";

declare const __SQL_DIALECT__: DialectName;

export function dialect(lang: DialectName, block: () => void) {
  if ([lang].includes(__SQL_DIALECT__)) {
    describe(__SQL_DIALECT__, block);
  }
}

export function parse(
  sql: string,
  options: Partial<ParserOptions> = {}
): Program {
  return stripUndefinedFields(
    stripRangeFields(
      parseAst(sql, {
        includeRange: true,
        dialect: __SQL_DIALECT__,
        ...options,
      })
    )
  );
}

export function parseStmt(sql: string, options: Partial<ParserOptions> = {}) {
  const statements = parse(sql, options).statements;
  if (statements.length !== 1) {
    throw new Error(
      `Expected exactly one statements, instead got ${statements.length}`
    );
  }
  return statements[0];
}

export function createParseSpecificStmt<TType extends Node["type"]>(
  type: TType
) {
  return (sql: string, options: Partial<ParserOptions> = {}) => {
    const stmt = parseStmt(sql, options);
    if (stmt.type !== type) {
      throw new Error(`Expected ${type}, instead got ${stmt.type}`);
    }
    return stmt as Extract<Node, { type: TType }>;
  };
}

export const parseSelect = createParseSpecificStmt("select_stmt");

export function parseExpr(sql: string, options: Partial<ParserOptions> = {}) {
  const stmt = parseSelect(`SELECT ${sql}`, options);
  if (stmt.columns.length !== 1) {
    throw new Error(
      `Expected single column in select, instead got ${stmt.columns.length}`
    );
  }
  return stmt.columns[0];
}

function stripUndefinedFields<T extends Node>(ast: T): T {
  astVisitAll(ast, (node: Record<any, any>) => {
    for (const key of Object.keys(node)) {
      if (node[key] === undefined) {
        delete node[key];
      }
    }
  });
  return ast;
}

// Validates that range field is present, then discards it.
function stripRangeFields<T extends Node>(ast: T): T {
  astVisitAll(ast, (node) => {
    if (!node.range) {
      throw new Error(`Expected 'range' field in Node of type ${node.type}`);
    }
    delete node.range;
  });
  return ast;
}
