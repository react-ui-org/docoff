const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { TSDocParser } = require('@microsoft/tsdoc');
const ts = require('typescript');

/**
 * Standalone function to process docoff-function-doc elements in HTML files
 * and replace them with static HTML content
 */
async function processDocoffFunctionDoc(options = {}) {
  const {
    sourceDir = 'public',
    outputDir = 'public',
    htmlPattern = '**/*.html',
  } = options;

  console.log('Processing docoff-function-doc elements...');

  // Find all HTML files to process
  const htmlFiles = glob.sync(path.join(sourceDir, htmlPattern));

  for (const htmlFile of htmlFiles) {
    console.log(`Processing ${htmlFile}...`);
    
    let content = fs.readFileSync(htmlFile, 'utf-8');
    let hasChanges = false;

    // Find all docoff-function-doc elements
    const regex = /<docoff-function-doc\s+src="([^"]+)"><\/docoff-function-doc>/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const srcAttribute = match[1];
      const [filePath, functionName] = srcAttribute.split(':');

      if (filePath && functionName) {
        try {
          const htmlContent = await generateFunctionDoc(filePath, functionName, path.dirname(htmlFile));
          content = content.replace(match[0], htmlContent);
          hasChanges = true;
          console.log(`  Replaced docoff-function-doc for ${srcAttribute}`);
        } catch (error) {
          console.warn(`  Warning: Failed to process docoff-function-doc for ${srcAttribute}: ${error.message}`);
          // Replace with error message
          const errorHtml = `<div style="color: red;">Error loading function documentation: ${error.message}</div>`;
          content = content.replace(match[0], errorHtml);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      // Calculate output path
      const outputPath = path.resolve(outputDir, path.relative(sourceDir, htmlFile));
      
      // Ensure output directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      // Write the updated content
      fs.writeFileSync(outputPath, content, 'utf-8');
      console.log(`  Updated ${outputPath}`);
    }
  }

  console.log('Finished processing docoff-function-doc elements.');
}

async function generateFunctionDoc(filePath, functionName, baseDir) {
  // Resolve the absolute path to the TypeScript file
  const fullPath = path.resolve(baseDir, filePath.replace(/^\//, ''));

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const fileContent = fs.readFileSync(fullPath, 'utf-8');

  // Parse TypeScript file
  const sourceFile = ts.createSourceFile(
    fullPath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  // Find the specific function
  const functionNode = findFunctionNode(sourceFile, functionName);

  if (!functionNode) {
    throw new Error(`Function '${functionName}' not found in ${filePath}`);
  }

  // Extract TSDoc comment
  const tsdocComment = extractTSDocComment(sourceFile, functionNode);

  if (!tsdocComment) {
    throw new Error(`No TSDoc comment found for function '${functionName}'`);
  }

  // Extract type information from the function
  const typeInfo = extractTypeInformation(functionNode);

  // Parse TSDoc comment
  const parser = new TSDocParser();
  const parserContext = parser.parseString(tsdocComment);

  if (parserContext.log.messages.length > 0) {
    console.warn(`TSDoc parsing warnings for ${functionName}:`, parserContext.log.messages);
  }

  // Generate HTML from parsed TSDoc
  return generateHTMLFromTSDoc(functionName, parserContext.docComment, typeInfo);
}

function findFunctionNode(sourceFile, functionName) {
  let functionNode = null;

  const visit = (node) => {
    if (ts.isFunctionDeclaration(node) && node.name && node.name.text === functionName) {
      functionNode = node;
      return;
    }

    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.name.text === functionName) {
          if (declaration.initializer && 
              (ts.isFunctionExpression(declaration.initializer) || 
               ts.isArrowFunction(declaration.initializer))) {
            functionNode = node;
            return;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return functionNode;
}

function extractTSDocComment(sourceFile, functionNode) {
  // Get leading trivia (comments) for the function node
  const leadingTrivia = functionNode.getFullText().substring(0, functionNode.getLeadingTriviaWidth());

  // Look for TSDoc comment (/** ... */)
  const tsdocRegex = /\/\*\*[\s\S]*?\*\//g;
  const matches = leadingTrivia.match(tsdocRegex);

  if (matches && matches.length > 0) {
    // Return the last (closest) TSDoc comment
    return matches[matches.length - 1];
  }

  return null;
}

function extractTypeInformation(functionNode) {
  const typeInfo = {
    parameters: [],
    returnType: null
  };

  // Extract parameter types
  if (functionNode.parameters) {
    for (const param of functionNode.parameters) {
      const paramName = param.name.text;
      let paramType = 'any';
      
      if (param.type) {
        paramType = param.type.getText();
      }
      
      const isOptional = param.questionToken !== undefined || param.initializer !== undefined;
      
      typeInfo.parameters.push({
        name: paramName,
        type: paramType,
        optional: isOptional
      });
    }
  }

  // Extract return type
  if (functionNode.type) {
    typeInfo.returnType = functionNode.type.getText();
  }

  return typeInfo;
}

function generateHTMLFromTSDoc(functionName, docComment, typeInfo) {
  const summary = docComment.summarySection;
  const params = docComment.params;
  const returnsBlock = docComment.returnsBlock;

  let html = '<dl>';

  // Function name and description
  html += `<dt><strong>${functionName}</strong></dt>`;

  if (summary && summary.nodes.length > 0) {
    const description = extractTextFromNodes(summary.nodes);
    html += `<dd>${description}</dd>`;
  }

  // Parameters
  if (params.blocks.length > 0) {
    for (const param of params.blocks) {
      const paramName = param.parameterName;
      const paramDescription = param.content ? extractTextFromNodes(param.content.nodes) : '';
      
      // Find type information for this parameter
      const typeInfoParam = typeInfo.parameters.find(p => p.name === paramName);
      const typeDisplay = typeInfoParam ? `<span style="color: #0066cc;">${typeInfoParam.type}</span>` : '';
      const optionalDisplay = typeInfoParam && typeInfoParam.optional ? ' (optional)' : '';
      
      html += `<dt>Parameter: <code>${paramName}</code>${typeDisplay ? `: ${typeDisplay}` : ''}${optionalDisplay}</dt>`;
      html += `<dd>${paramDescription}</dd>`;
    }
  }

  // Returns
  if (returnsBlock && returnsBlock.content) {
    const returnDescription = extractTextFromNodes(returnsBlock.content.nodes);
    const returnTypeDisplay = typeInfo.returnType ? `<span style="color: #009900;">${typeInfo.returnType}</span>` : '';
    html += `<dt>Returns${returnTypeDisplay ? `: ${returnTypeDisplay}` : ''}</dt>`;
    html += `<dd>${returnDescription}</dd>`;
  }

  html += '</dl>';

  return html;
}

function extractTextFromNodes(nodes) {
  return nodes.map(node => {
    if (node.kind === 'PlainText') {
      return node.text;
    } else if (node.kind === 'Paragraph') {
      return extractTextFromNodes(node.nodes);
    } else if (node.kind === 'CodeSpan') {
      return `<code>${node.code}</code>`;
    }
    return '';
  }).join('').trim();
}

module.exports = {
  processDocoffFunctionDoc,
  generateFunctionDoc,
};

// If called directly from command line
if (require.main === module) {
  processDocoffFunctionDoc().catch(console.error);
}