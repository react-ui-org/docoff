import { parseFunctionDoc } from './parseFunctionDoc';

/**
 * Fetches a JavaScript/TypeScript file and generates function documentation table
 * @param {string} functionUrl - URL to the JS/TS file, optionally with :functionName
 * @returns {Promise<HTMLElement>} Promise that resolves to documentation element
 */
export const getFunctionDocTable = async (functionUrl) => {
  try {
    // Parse file path and function name
    const [filePath, targetFunctionName] = functionUrl.split(':');

    // Fetch the file content
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const fileContent = await response.text();

    // Parse the functions and their documentation
    const functions = parseFunctionDoc(fileContent, targetFunctionName);

    if (functions.length === 0) {
      const noFunctionsEl = document.createElement('div');
      if (targetFunctionName) {
        noFunctionsEl.textContent = `Function "${targetFunctionName}" not found in this file.`;
      } else {
        noFunctionsEl.textContent = 'No documented functions found in this file.';
      }
      return noFunctionsEl;
    }

    // Since we now only support one function, get the first (and only) function
    const func = functions[0];

    // Create section for the function
    const functionSection = document.createElement('div');

    // Function description
    if (func.description) {
      const description = document.createElement('p');
      description.textContent = func.description;
      functionSection.appendChild(description);
    }

    // Create description list for parameters and return value
    const dl = document.createElement('dl');

    // Add parameters and return value in one table
    if (func.params && func.params.length > 0) {
      func.params.forEach((param) => {
        const paramName = document.createElement('dt');
        paramName.innerHTML = `<code>${param.name}</code>`;

        const paramDetails = document.createElement('dd');

        let paramText = '';
        if (param.type) {
          paramText += `<code>${param.type}</code>`;
        }
        if (param.optional) {
          paramText += ' (optional)';
        }
        if (param.description) {
          paramText += ` - ${param.description}`;
        }

        paramDetails.innerHTML = paramText;

        dl.appendChild(paramName);
        dl.appendChild(paramDetails);
      });
    }

    // Add return value
    if (func.returns) {
      const returnsName = document.createElement('dt');
      returnsName.innerHTML = '<code>returns</code>';

      const returnsDetails = document.createElement('dd');

      let returnText = '';
      if (func.returns.type) {
        returnText += `<code>${func.returns.type}</code>`;
      }
      if (func.returns.description) {
        returnText += ` - ${func.returns.description}`;
      }

      returnsDetails.innerHTML = returnText;

      dl.appendChild(returnsName);
      dl.appendChild(returnsDetails);
    }

    functionSection.appendChild(dl);

    return functionSection;
  } catch (error) {
    // Suppress console in production, but allow for debugging
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.error('Error generating function documentation table:', error);
    }
    const errorEl = document.createElement('div');
    errorEl.innerHTML = `<strong>Error:</strong> ${error.message}`;
    return errorEl;
  }
};
