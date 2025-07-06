// These are available as transitive dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from '@babel/parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as doctrine from 'doctrine';

/**
 * Formats a doctrine type object into a readable string
 * @param {Object} type - The doctrine type object
 * @returns {string} Formatted type string
 */
const formatType = (type) => {
  if (!type) {
    return 'any';
  }

  switch (type.type) {
    case 'NameExpression':
      return type.name;
    case 'OptionalType':
      return `${formatType(type.expression)}?`;
    case 'UnionType':
      return type.elements.map(formatType).join(' | ');
    case 'ArrayType':
      return `${formatType(type.elements[0])}[]`;
    case 'TypeApplication':
      return `${formatType(type.expression)}<${type.applications.map(formatType).join(', ')}>`;
    default:
      return type.name || 'any';
  }
};

/**
 * Extracts JSDoc information from a function node
 * @param {Object} node - The AST node
 * @param {string} fileContent - Original file content for extracting comments
 * @param {string} [customName] - Custom function name for variable declarations
 * @returns {Object|null} Function documentation object or null
 */
const extractFunctionDoc = (node, fileContent, customName) => {
  const functionName = customName || node.id?.name || node.key?.name;
  if (!functionName) {
    return null;
  }

  // Find the preceding comment block
  const leadingComments = node.leadingComments || [];
  let jsdocComment = null;

  // Look for JSDoc comment (/** ... */)
  for (let i = leadingComments.length - 1; i >= 0; i -= 1) {
    const comment = leadingComments[i];
    if (comment.type === 'CommentBlock' && comment.value.startsWith('*')) {
      jsdocComment = comment;
      break;
    }
  }

  if (!jsdocComment) {
    // If no leading comments on the node, try to find comments manually
    // by looking at the source code before the function
    const lines = fileContent.split('\n');
    const functionLine = node.loc?.start?.line;

    if (functionLine) {
      // Look backwards for JSDoc comment
      for (let i = functionLine - 2; i >= 0; i -= 1) {
        const line = lines[i]?.trim();
        if (line === '*/') {
          // Found end of comment block, now find the start
          let commentStart = i;
          for (let j = i - 1; j >= 0; j -= 1) {
            if (lines[j]?.trim().startsWith('/**')) {
              commentStart = j;
              break;
            }
          }

          // Extract the comment
          const commentLines = lines.slice(commentStart, i + 1);
          const commentText = commentLines.join('\n');
          jsdocComment = { value: commentText.replace(/^\/\*\*|\*\/$/g, '') };
          break;
        } else if (line && !line.startsWith('*') && !line.startsWith('//')) {
          // Hit non-comment content, stop looking
          break;
        }
      }
    }
  }

  if (!jsdocComment) {
    return null;
  }

  try {
    // Parse the JSDoc comment with doctrine
    const parsedComment = doctrine.parse(`/*${jsdocComment.value}*/`, {
      sloppy: true,
      unwrap: true,
    });

    return {
      description: parsedComment.description || '',
      name: functionName,
      params: parsedComment.tags
        ?.filter((tag) => tag.title === 'param')
        ?.map((tag) => ({
          description: tag.description || '',
          name: tag.name,
          optional: tag.type?.type === 'OptionalType' || tag.name?.includes('['),
          type: tag.type ? formatType(tag.type) : 'any',
        })) || [],
      returns: parsedComment.tags
        ?.find((tag) => tag.title === 'returns' || tag.title === 'return')
        ? {
          description: parsedComment.tags.find((tag) => tag.title === 'returns' || tag.title === 'return').description || '',
          type: formatType(parsedComment.tags.find((tag) => tag.title === 'returns' || tag.title === 'return').type) || 'void',
        }
        : null,
    };
  } catch (error) {
    // Suppress console in production, but allow for debugging
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.error('Error parsing JSDoc comment:', error);
    }
    return null;
  }
};

/**
 * Parses a JavaScript/TypeScript file to extract function documentation
 * @param {string} fileContent - The content of the JS/TS file
 * @returns {Array} Array of function documentation objects
 */
export const parseFunctionDoc = (fileContent) => {
  try {
    // Parse the file content into an AST
    const ast = parse(fileContent, {
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      plugins: [
        'jsx',
        'typescript',
        'decorators-legacy',
        'classProperties',
        'asyncGenerators',
        'functionBind',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'dynamicImport',
        'nullishCoalescingOperator',
        'optionalChaining',
      ],
      sourceType: 'module',
      strictMode: false,
    });

    const functions = [];

    // Walk through the AST to find function declarations and expressions
    const walkNode = (node) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      // Handle function declarations
      if (node.type === 'FunctionDeclaration' && node.id?.name) {
        const functionDoc = extractFunctionDoc(node, fileContent);
        if (functionDoc) {
          functions.push(functionDoc);
        }
      }

      // Handle variable declarations with function expressions
      if (node.type === 'VariableDeclaration') {
        node.declarations?.forEach((declaration) => {
          if (
            declaration.id?.name
            && (declaration.init?.type === 'FunctionExpression'
              || declaration.init?.type === 'ArrowFunctionExpression')
          ) {
            const functionDoc = extractFunctionDoc(declaration, fileContent, declaration.id.name);
            if (functionDoc) {
              functions.push(functionDoc);
            }
          }
        });
      }

      // Recursively walk child nodes
      Object.values(node).forEach((child) => {
        if (Array.isArray(child)) {
          child.forEach(walkNode);
        } else if (child && typeof child === 'object') {
          walkNode(child);
        }
      });
    };

    walkNode(ast);
    return functions;
  } catch (error) {
    // Suppress console in production, but allow for debugging
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.error('Error parsing function documentation:', error);
    }
    return [];
  }
};
