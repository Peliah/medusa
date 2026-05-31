import type { PreviewFormat } from "@/lib/query-engine/generators"

type TokenKind =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "operator"
  | "property"
  | "plain"

interface Token {
  kind: TokenKind
  text: string
}

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "NOT",
  "IN",
  "IS",
  "NULL",
  "BETWEEN",
  "LIKE",
  "REGEXP",
  "TRUE",
  "FALSE",
  "DATE",
  "CURRENT_DATE",
  "DATE_TRUNC",
  "INTERVAL",
])

const GRAPHQL_KEYWORDS = new Set(["query", "where", "true", "false", "null"])

function tokenClass(kind: TokenKind): string {
  switch (kind) {
    case "keyword":
      return "text-sky-300"
    case "string":
      return "text-emerald-300"
    case "number":
      return "text-amber-300"
    case "comment":
      return "text-background/45"
    case "operator":
      return "text-violet-300"
    case "property":
      return "text-cyan-300"
    default:
      return "text-background"
  }
}

function tokenizeSqlLine(line: string): Token[] {
  if (line.trimStart().startsWith("--")) {
    return [{ kind: "comment", text: line }]
  }

  const tokens: Token[] = []
  const pattern =
    /('(?:''|[^'])*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Z_][A-Z0-9_]*\b)|([<>=!]+)|(\(|\)|,|\*)/gi

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: "plain", text: line.slice(lastIndex, match.index) })
    }

    const [raw, stringLit, numberLit, word, operator] = match

    if (stringLit) tokens.push({ kind: "string", text: raw })
    else if (numberLit) tokens.push({ kind: "number", text: raw })
    else if (word) {
      tokens.push({
        kind: SQL_KEYWORDS.has(raw) ? "keyword" : "plain",
        text: raw,
      })
    } else if (operator) tokens.push({ kind: "operator", text: raw })
    else tokens.push({ kind: "plain", text: raw })

    lastIndex = match.index + raw.length
  }

  if (lastIndex < line.length) {
    tokens.push({ kind: "plain", text: line.slice(lastIndex) })
  }

  return tokens.length > 0 ? tokens : [{ kind: "plain", text: line }]
}

function tokenizeMongoLine(line: string): Token[] {
  const trimmed = line.trim()
  if (trimmed.startsWith("//")) {
    return [{ kind: "comment", text: line }]
  }

  const tokens: Token[] = []
  const pattern =
    /("(?:\\.|[^"\\])*")|(\$-?\w+)|(\b\d+(?:\.\d+)?\b)|("[\w$]+"\s*:)|(\{|\}|\[|\]|,|:)/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: "plain", text: line.slice(lastIndex, match.index) })
    }

    const [raw, stringLit, mongoOp, numberLit, key] = match

    if (stringLit) tokens.push({ kind: "string", text: raw })
    else if (mongoOp) tokens.push({ kind: "operator", text: raw })
    else if (numberLit) tokens.push({ kind: "number", text: raw })
    else if (key) tokens.push({ kind: "property", text: raw })
    else tokens.push({ kind: "plain", text: raw })

    lastIndex = match.index + raw.length
  }

  if (lastIndex < line.length) {
    tokens.push({ kind: "plain", text: line.slice(lastIndex) })
  }

  return tokens.length > 0 ? tokens : [{ kind: "plain", text: line }]
}

function tokenizeGraphqlLine(line: string): Token[] {
  const trimmed = line.trim()
  if (trimmed.startsWith("#")) {
    return [{ kind: "comment", text: line }]
  }

  const tokens: Token[] = []
  const pattern =
    /("(?:\\.|[^"\\])*")|(_\w+)|(\bquery\b)|(\b\d+(?:\.\d+)?\b)|(\{|\}|\(|\)|\[|\]|,|:)/gi

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ kind: "plain", text: line.slice(lastIndex, match.index) })
    }

    const [raw, stringLit, graphOp, queryKw, numberLit] = match

    if (stringLit) tokens.push({ kind: "string", text: raw })
    else if (graphOp) tokens.push({ kind: "operator", text: raw })
    else if (queryKw) {
      tokens.push({
        kind: GRAPHQL_KEYWORDS.has(raw.toLowerCase()) ? "keyword" : "plain",
        text: raw,
      })
    } else if (numberLit) tokens.push({ kind: "number", text: raw })
    else tokens.push({ kind: "plain", text: raw })

    lastIndex = match.index + raw.length
  }

  if (lastIndex < line.length) {
    tokens.push({ kind: "plain", text: line.slice(lastIndex) })
  }

  return tokens.length > 0 ? tokens : [{ kind: "plain", text: line }]
}

function tokenizeLine(line: string, format: PreviewFormat): Token[] {
  switch (format) {
    case "sql":
      return tokenizeSqlLine(line)
    case "mongo":
      return tokenizeMongoLine(line)
    case "graphql":
      return tokenizeGraphqlLine(line)
  }
}

export function highlightCode(code: string, format: PreviewFormat) {
  return code.split("\n").map((line, lineIndex) => ({
    key: lineIndex,
    tokens: tokenizeLine(line, format),
  }))
}

export { tokenClass }
