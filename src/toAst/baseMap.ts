import { FullTransformMap, AllColumns } from "sql-parser-cst";
import { Node as AstNode } from "../ast/Node";

export const baseMap: FullTransformMap<AstNode, AllColumns> = {
  all_columns: (node) => node,
};
