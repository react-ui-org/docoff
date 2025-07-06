import { parseFunctionDoc } from './parseFunctionDoc';

/**
 * Fetches a JavaScript/TypeScript file and generates function documentation table
 * @param {string} functionUrl - URL to the JS/TS file
 * @returns {Promise<HTMLElement>} Promise that resolves to documentation element
 */
export const getFunctionDocTable = async (functionUrl) => {
  try {
    // Fetch the file content
    const response = await fetch(functionUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const fileContent = await response.text();

    // Parse the functions and their documentation
    const functions = parseFunctionDoc(fileContent);

    if (functions.length === 0) {
      const noFunctionsEl = document.createElement('div');
      noFunctionsEl.style.fontStyle = 'italic';
      noFunctionsEl.textContent = 'No documented functions found in this file.';
      return noFunctionsEl;
    }

    // Create a container for all function documentation
    const container = document.createElement('div');
    container.style.fontFamily = 'inherit';

    functions.forEach((func, index) => {
      // Create section for each function
      const functionSection = document.createElement('div');
      if (index > 0) {
        functionSection.style.marginTop = '2rem';
        functionSection.style.paddingTop = '1rem';
        functionSection.style.borderTop = '1px solid #e0e0e0';
      }

      // Function name as heading
      const heading = document.createElement('h4');
      heading.textContent = func.name;
      heading.style.margin = '0 0 0.5rem 0';
      heading.style.fontWeight = 'bold';
      functionSection.appendChild(heading);

      // Function description
      if (func.description) {
        const description = document.createElement('p');
        description.textContent = func.description;
        description.style.margin = '0 0 1rem 0';
        description.style.color = '#666';
        functionSection.appendChild(description);
      }

      // Create description list for parameters and return value
      const dl = document.createElement('dl');
      dl.style.margin = '0';
      dl.style.display = 'grid';
      dl.style.gridTemplateColumns = 'auto 1fr';
      dl.style.gap = '0.5rem 1rem';

      // Add parameters
      if (func.params && func.params.length > 0) {
        const paramsHeader = document.createElement('dt');
        paramsHeader.textContent = 'Parameters:';
        paramsHeader.style.fontWeight = 'bold';
        paramsHeader.style.gridColumn = '1 / -1';
        paramsHeader.style.marginTop = '0.5rem';
        dl.appendChild(paramsHeader);

        func.params.forEach((param) => {
          const paramName = document.createElement('dt');
          paramName.innerHTML = `<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px;">${param.name}</code>`;
          paramName.style.marginLeft = '1rem';

          const paramDetails = document.createElement('dd');
          paramDetails.style.margin = '0';

          let paramText = '';
          if (param.type) {
            paramText += `<code style="background: #e3f2fd; padding: 2px 4px; border-radius: 3px; color: #1976d2;">${param.type}</code>`;
          }
          if (param.optional) {
            paramText += ' <em>(optional)</em>';
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
        const returnsHeader = document.createElement('dt');
        returnsHeader.textContent = 'Returns:';
        returnsHeader.style.fontWeight = 'bold';
        returnsHeader.style.marginTop = '0.5rem';

        const returnsDetails = document.createElement('dd');
        returnsDetails.style.margin = '0';

        let returnText = '';
        if (func.returns.type) {
          returnText += `<code style="background: #e8f5e8; padding: 2px 4px; border-radius: 3px; color: #2e7d32;">${func.returns.type}</code>`;
        }
        if (func.returns.description) {
          returnText += ` - ${func.returns.description}`;
        }

        returnsDetails.innerHTML = returnText;

        dl.appendChild(returnsHeader);
        dl.appendChild(returnsDetails);
      }

      functionSection.appendChild(dl);
      container.appendChild(functionSection);
    });

    return container;
  } catch (error) {
    // Suppress console in production, but allow for debugging
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.error('Error generating function documentation table:', error);
    }
    const errorEl = document.createElement('div');
    errorEl.style.color = 'red';
    errorEl.style.padding = '1rem';
    errorEl.style.border = '1px solid #ffcdd2';
    errorEl.style.borderRadius = '4px';
    errorEl.style.backgroundColor = '#ffebee';
    errorEl.innerHTML = `<strong>Error:</strong> ${error.message}`;
    return errorEl;
  }
};
