import { ElementorPrintMethod, IElementorBuildConfig, TElementorData } from '@/types';

const VALUE_STATEMENT_OPEN: string = '{{';
const VALUE_PATTERN_STRING: string = '{{(.+?)}}';
const CYCLE_STATEMENT_OPEN: string = '{{forEach';
const CYCLE_STATEMENT_CLOSE: string = '{{/forEach}}';
const CONDITION_PATTERN_STRING: string = '(.+) (==|===|!=|!==|>|>=|<|<=|&&|\|\||%|\^) (.+)';
const CONDITION_STATEMENT_OPEN: string = '{{if';
const CONDITION_STATEMENT_CLOSE: string = '{{/if}}';
const CYCLE_STATEMENT_PATTERN_STRING: string = '{{forEach (.+?) in (.+?)}}(.*){{/forEach}}';
const CONDITION_STATEMENT_PATTERN_STRING: string = '{{if (.+?)}}(.+?)(?:{{else}}(.+?))?{{/if}}';

export class Elementor {
  public static build(config: IElementorBuildConfig): void {
    try {
      if (!Boolean(config.templateNode)) throw 'templateNode is null or undefined';
      let templateNodeContentString = this.getContentFromTemplateNode(config.templateNode);

      const isDataDefined = !(config.templateData === undefined || config.templateData === null);
      if (isDataDefined) {
        templateNodeContentString = templateNodeContentString.replace(/\n/g, '');
        templateNodeContentString = this.parse(templateNodeContentString, config.templateData as TElementorData);
      }

      const parsedNode = this._utils.stringToNode(templateNodeContentString);
      this.print((Array.from(parsedNode.childNodes) as HTMLElement[]), config.printTargetNode, config.printMethod);
    } catch (error) {
      console.error(error);
    }
  }

  private static getContentFromTemplateNode = (templateNode: HTMLTemplateElement | HTMLElement): string => {
    const templateNodeContent = templateNode.innerHTML;
    const domParser = new DOMParser();
    const parsedDocument = domParser.parseFromString(templateNodeContent as string, 'text/html');
    const parsedDocumentBodyNode = parsedDocument.querySelector('body') as HTMLElement;
    return parsedDocumentBodyNode.innerHTML;
  }

  private static print(node: ChildNode[], target: HTMLElement, method: ElementorPrintMethod): void {
    if (method === ElementorPrintMethod.AFTER_BEGIN || method === ElementorPrintMethod.AFTER_END) {
      node.reverse();
    }
    node.forEach(nodeItem => {
      nodeItem.nodeType !== Node.TEXT_NODE && target.insertAdjacentElement(method, (nodeItem as HTMLElement));
      nodeItem.nodeType === Node.TEXT_NODE && target.insertAdjacentText(method, nodeItem.nodeValue as string);
    });
  }

  private static parseValue(template: string, data: TElementorData): string {
    let compiledTemplate = '';

    const matches = template.match(new RegExp(VALUE_PATTERN_STRING));
    if (matches?.length) {
      const fullMatch = matches[0];
      const valueIdentifier = matches[1];
      const valueFromData = this._utils.getValueByPath(data, valueIdentifier);
      compiledTemplate = valueFromData !== undefined ? valueFromData : fullMatch;
    }

    return compiledTemplate;
  }

  private static parseCondition(template: string, data: TElementorData): string {
    const conditionStatementPattern = new RegExp(CONDITION_STATEMENT_PATTERN_STRING, '');
    const conditionPattern = new RegExp(CONDITION_PATTERN_STRING, '');

    let compiledTemplate = '';

    const statementMatches = template.match(conditionStatementPattern);
    if (statementMatches?.length) {
      const condition = statementMatches[1];
      const parsedCondition = conditionPattern.exec(condition);
      const isConditionImplicit = !Boolean(parsedCondition);
      const positiveContent = statementMatches[2];
      const negativeContent = statementMatches[3] as string | undefined;

      if (isConditionImplicit) {
        const valueFromData = this._utils.getValueByPath(data, condition);
        const implicitCheck = Boolean(valueFromData);

        const parsedContent = this._utils.if.parseContentFromCondition(implicitCheck, data, positiveContent, negativeContent);
        compiledTemplate = parsedContent;
      } else if (parsedCondition?.length) {
        const firstSanitizedParameter = this._utils.if.sanitizeParameter(parsedCondition[1]);
        const firstParameter = (
          this._utils.if.isParameterLiteral(firstSanitizedParameter) ?
            this._utils.if.fixStringLiteral(firstSanitizedParameter) :
            this._utils.getValueByPath(data, firstSanitizedParameter as string)
        );

        const secondSanitizedParameter = this._utils.if.sanitizeParameter(parsedCondition[3]);
        const secondParameter = (
          this._utils.if.isParameterLiteral(secondSanitizedParameter) ?
            this._utils.if.fixStringLiteral(secondSanitizedParameter) :
            this._utils.getValueByPath(data, secondSanitizedParameter as string)
        );

        const operator = parsedCondition[2];

        let conditionResult: boolean = false;
        switch (operator) {
          case '==': conditionResult = Boolean((firstParameter as any) == (secondParameter as any)); break;
          case '===': conditionResult = Boolean((firstParameter as any) === (secondParameter as any)); break;
          case '!=': conditionResult = Boolean((firstParameter as any) != (secondParameter as any)); break;
          case '!==': conditionResult = Boolean((firstParameter as any) !== (secondParameter as any)); break;
          case '>': conditionResult = Boolean((firstParameter as any) > (secondParameter as any)); break;
          case '>=': conditionResult = Boolean((firstParameter as any) >= (secondParameter as any)); break;
          //case '<':   conditionResult = Boolean((firstParameter as any) <   (secondParameter as any)); break;
          //case '<=':  conditionResult = Boolean((firstParameter as any) <=  (secondParameter as any)); break;
          case '&&': conditionResult = Boolean((firstParameter as any) && (secondParameter as any)); break;
          case '||': conditionResult = Boolean((firstParameter as any) || (secondParameter as any)); break;
          case '%': conditionResult = Boolean(parseFloat(firstParameter as string) % parseFloat(secondParameter as string)); break;
          case '^': conditionResult = Boolean(parseFloat(firstParameter as string) ^ parseFloat(secondParameter as string)); break;
        }

        const parsedContent = this._utils.if.parseContentFromCondition(conditionResult, data, positiveContent, negativeContent);
        compiledTemplate = parsedContent;
      }
    }

    return compiledTemplate;
  }

  private static parseCycle(template: string, data: TElementorData): string {
    let compiledTemplate = '';

    const matches = template.match(new RegExp(CYCLE_STATEMENT_PATTERN_STRING));
    if (matches) {
      const keyOfListIdentifier = matches[1];
      const listIdentifier = matches[2];
      const cycleContent = matches[3];

      if (data) {
        const list = this._utils.getValueByPath(data, listIdentifier);
        if (!Array.isArray(list)) throw `parameter '${listIdentifier}' not iterable`;

        list.forEach(listItem => {
          const iterationData = {
            ...this._utils.deepCopy(data),
            [keyOfListIdentifier]: listItem,
          };
          compiledTemplate += this.parse(cycleContent, iterationData);
        });
      }
    }
    return compiledTemplate;
  }

  private static parse(template: string, data: TElementorData): string {
    let isTagOpen = false;
    let tagOpenStack = 0;
    let currentClosingTag = '';
    let openTagIndex = -1;
    let closeTagIndex = -1;
    let compiledTemplate = '';

    for (let i = 0; i < template.length; i++) {
      const isConditionOpening = template.slice(i, i + CONDITION_STATEMENT_OPEN.length) === CONDITION_STATEMENT_OPEN;
      const isCycleOpening = template.slice(i, i + CYCLE_STATEMENT_OPEN.length) === CYCLE_STATEMENT_OPEN;
      const isValueOpening = template.slice(i, i + VALUE_STATEMENT_OPEN.length) === VALUE_STATEMENT_OPEN;
      const isClosingCurrentTag = isTagOpen && currentClosingTag && template.slice(i, i + currentClosingTag.length) === currentClosingTag;
      const isOpeningNested = isTagOpen && (
        (isCycleOpening && currentClosingTag === CYCLE_STATEMENT_CLOSE) ||
        (isConditionOpening && currentClosingTag === CONDITION_STATEMENT_CLOSE)
      );

      if (isConditionOpening || isCycleOpening) {
        if (isOpeningNested) {
          tagOpenStack++;
        } else if (!isTagOpen) {
          isTagOpen = true;
          openTagIndex = i;

          currentClosingTag =
            isCycleOpening ? CYCLE_STATEMENT_CLOSE :
              isConditionOpening ? CONDITION_STATEMENT_CLOSE :
                '';
        }
      } else if (isClosingCurrentTag) {
        if (tagOpenStack !== 0) {
          tagOpenStack--;
        } else {
          isTagOpen = false;
          closeTagIndex = i + currentClosingTag.length;
          i += (currentClosingTag.length - 1);
          const currentBlockTemplate = template.slice(openTagIndex, closeTagIndex);
          const isBlockCondition = currentBlockTemplate.startsWith(CONDITION_STATEMENT_OPEN);
          const isBlockCycle = currentBlockTemplate.startsWith(CYCLE_STATEMENT_OPEN);

          const currentParsedBlock = (
            isBlockCondition ? this.parseCondition(currentBlockTemplate, data) :
              isBlockCycle ? this.parseCycle(currentBlockTemplate, data) :
                ''
          );
          compiledTemplate += currentParsedBlock;
          openTagIndex = -1;
          closeTagIndex = -1;
        }

      } else if (isValueOpening && !isTagOpen) {
        const valueMatches = template.slice(i).match(new RegExp(VALUE_PATTERN_STRING));
        if (valueMatches) {
          const fullMatch = valueMatches[0];
          const compiledValue = this.parseValue(fullMatch, data);
          compiledTemplate += compiledValue;
          i += (fullMatch.length - 1);
        }
      } else if (!isTagOpen) {
        compiledTemplate += template[i];
      }
    }

    return compiledTemplate;
  }

  public static compile(template: string, data: TElementorData): string {
    return this.parse(template, data);
  }

  private static _utils = {
    nodeToString: (node: HTMLElement): string => {
      return node.outerHTML.replace(/\n/g, '');
    },
    stringToNode: (node: string): HTMLElement => {
      const resultNode = document.createElement('div');
      resultNode.innerHTML = node;
      return resultNode;

    },
    removeCharacterFromString: (string: string, characterIndex: number): string => {
      return string.substring(0, characterIndex) + string.substring(characterIndex + 1, string.length);
    },
    deepCopy: (inObject: any): any => {
      let outObject, value, key;
      if (typeof inObject !== 'object' || inObject === null) {
        return inObject;
      }
      outObject = Array.isArray(inObject) ? [] : {};
      for (key in inObject) {
        value = inObject[key];
        (outObject as any)[key] = this._utils.deepCopy(value);
      }
      return outObject;
    },
    getValueByPath: (obj: any, path: string): any => {
      const keys = path.split('.');
      let value = obj;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          return undefined;
        }
      }
      return value;
    },
    if: {
      parseContentFromCondition: (conditionResult: boolean, data: any, positiveContent?: string, negativeContent?: string): string => {
        let compiledContent = '';
        compiledContent = this.parse(
          conditionResult ? positiveContent || '' : negativeContent || '',
          data
        );
        return compiledContent;
      },
      sanitizeParameter: (parameter: string): boolean | null | undefined | string | number => {
        return (
          !Number.isNaN(parseFloat(parameter)) ? parseFloat(parameter) :
            parameter === 'true' ? true :
              parameter === 'false' ? false :
                parameter === 'undefined' ? undefined :
                  parameter === 'null' ? null :
                    parameter
        );
      },
      isParameterLiteralString: (parameter: boolean | null | undefined | string | number): boolean => {
        return typeof parameter === 'string' && (
          ((parameter as string).startsWith(`'`) && (parameter as string).endsWith(`'`)) ||
          ((parameter as string).startsWith(`'`) && (parameter as string).endsWith(`'`))
        );
      },
      fixStringLiteral: (parameter: boolean | null | undefined | string | number): boolean | null | undefined | string | number => {
        if (this._utils.if.isParameterLiteralString(parameter)) {
          return (parameter as string).slice(1, (parameter as string).length - 1);
        } else {
          return parameter;
        }
      },
      isParameterLiteral: (parameter: boolean | null | undefined | string | number): boolean => {
        const isParamKeyword = Boolean(
          typeof parameter === 'number' ||
          this._utils.if.isParameterLiteralString(parameter) ||
          parameter === true ||
          parameter === false ||
          parameter === null ||
          parameter === undefined
        );
        return isParamKeyword;
      },
    }
  }
}