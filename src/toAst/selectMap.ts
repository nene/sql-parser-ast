import { TransformMap, AllSelectNodes } from "sql-parser-cst";
import {
  Expr,
  Identifier,
  NamedWindow,
  Node as AstNode,
  SelectStmt,
} from "../ast/Node";
import { cstToAst } from "../cstToAst";
import {
  keywordToBoolean,
  keywordToString,
  mergeClauses,
} from "./transformUtils";
import { isString } from "../utils";
import {
  fromClause,
  limitClause,
  orderByClause,
  whereClause,
  withClause,
} from "./clauses";

export const selectMap: TransformMap<AstNode, AllSelectNodes> = {
  compound_select_stmt: (node) => ({
    type: "compound_select_stmt",
    left: cstToAst(node.left),
    operator: keywordToString(node.operator),
    right: cstToAst(node.right),
  }),
  select_stmt: (node): SelectStmt => {
    return {
      type: "select_stmt",
      columns: [],
      ...mergeClauses(node.clauses, {
        select_clause: (clause) => ({
          columns: cstToAst<SelectStmt["columns"]>(clause.columns.items),
          distinct: keywordToString(clause.distinctKw),
        }),
        group_by_clause: (clause) => {
          if (clause.columns.type === "list_expr") {
            return { groupBy: cstToAst<Identifier[]>(clause.columns.items) };
          } else {
            return {};
          }
        },
        having_clause: (clause) => ({
          having: cstToAst<Expr>(clause.expr),
        }),
        window_clause: (clause) => ({
          window: cstToAst<NamedWindow[]>(clause.namedWindows.items),
        }),
        with_clause: withClause,
        from_clause: fromClause,
        where_clause: whereClause,
        order_by_clause: orderByClause,
        limit_clause: limitClause,
      }),
    };
  },
  with_clause: (node) => ({
    type: "with_clause",
    recursive: keywordToBoolean(node.recursiveKw),
    tables: cstToAst(node.tables.items),
  }),
  common_table_expression: (node) => ({
    type: "common_table_expression",
    table: cstToAst(node.table),
    expr: cstToAst(node.expr),
  }),
  join_expr: (node) => ({
    type: "join_expr",
    left: cstToAst(node.left),
    operator: isString(node.operator) ? "," : keywordToString(node.operator),
    right: cstToAst(node.right),
    specification: cstToAst(node.specification),
  }),
  join_on_specification: (node) => ({
    type: "join_on_specification",
    expr: cstToAst(node.expr),
  }),
  join_using_specification: (node) => ({
    type: "join_using_specification",
    columns: cstToAst(node.expr.expr.items),
  }),
  sort_specification: (node) => ({
    type: "sort_specification",
    expr: cstToAst(node.expr),
    order: keywordToString(node.orderKw),
    nulls: keywordToString(node.nullHandlingKw?.[1]),
  }),
  named_window: (node) => ({
    type: "named_window",
    name: cstToAst(node.name),
    window: cstToAst(node.window),
  }),
  window_definition: (node) => ({
    type: "window_definition",
    baseWindowName: cstToAst(node.baseWindowName),
    partitionBy: cstToAst(node.partitionBy?.specifications.items),
    orderBy: cstToAst(node.orderBy?.specifications.items),
    frame: cstToAst(node.frame),
  }),
};
