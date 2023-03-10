import { AllColumns, BaseNode } from "./Base";
import { DataType } from "./DataType";
import { Literal, StringLiteral } from "./Literal";
import { Node } from "./Node";
import { Program } from "./Program";
import { SubSelect, WindowDefinition } from "./Select";

export type AllExprNodes =
  | Expr
  | CaseWhen<Expr | Program>
  | CaseElse<Expr | Program>;

export type Expr =
  | ListExpr
  | BinaryExpr
  | PrefixOpExpr
  | PostfixOpExpr
  | BetweenExpr
  | CaseExpr
  | FuncCall
  | CastExpr
  | RaiseExpr
  | MemberExpr
  | Identifier
  | Literal;

export interface ListExpr<T = Node> extends BaseNode {
  type: "list_expr";
  items: T[];
}

export interface BinaryExpr extends BaseNode {
  type: "binary_expr";
  left: Expr;
  operator: string;
  right: Expr;
}

export interface PrefixOpExpr extends BaseNode {
  type: "prefix_op_expr";
  operator: "-" | "~" | "!" | "not" | "exists";
  expr: Expr;
}

export interface PostfixOpExpr extends BaseNode {
  type: "postfix_op_expr";
  operator:
    | "isnull" // SQLite
    | "notnull" // SQLite
    | "not null" // SQLite
    | "is unknown" // BigQuery, MySQL
    | "is not unknown"; // BigQuery, MySQL
  expr: Expr;
}

export interface BetweenExpr extends BaseNode {
  type: "between_expr";
  left: Expr;
  operator: "between" | "not between";
  begin: Expr;
  end: Expr;
}

export interface CaseExpr extends BaseNode {
  type: "case_expr";
  expr?: Expr;
  clauses: (CaseWhen<Expr> | CaseElse<Expr>)[];
}

export interface CaseWhen<T> extends BaseNode {
  type: "case_when";
  condition: Expr;
  result: T;
}

export interface CaseElse<T> extends BaseNode {
  type: "case_else";
  result: T;
}

export interface FuncCall extends BaseNode {
  type: "func_call";
  name: Identifier;
  args?: (Expr | AllColumns | SubSelect)[];
  distinct?: boolean;
  filter?: Expr;
  over?: Identifier | WindowDefinition;
}

export interface CastExpr extends BaseNode {
  type: "cast_expr";
  expr: Expr;
  dataType: DataType;
}

export interface RaiseExpr extends BaseNode {
  type: "raise_expr";
  args: ("ignore" | "rollback" | "abort" | "fail" | StringLiteral)[];
}

export interface MemberExpr extends BaseNode {
  type: "member_expr";
  object: Expr;
  property: Identifier; // ArraySubscript | AllColumns | Empty
}

export type EntityName = MemberExpr | Identifier;

export interface Identifier extends BaseNode {
  type: "identifier";
  name: string;
}
