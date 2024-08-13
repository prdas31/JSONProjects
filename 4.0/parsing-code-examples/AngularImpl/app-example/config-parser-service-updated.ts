import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigParserService {
  parseConfig(config: any): ParsedConfig {
    return {
      version: config.version,
      configType: config.configType,
      modelType: config.modelType,
      modelImplementation: this.parseModelImplementation(config.modelImplementation),
      metadata: this.parseMetadata(config.metadata),
      parameters: this.parseParameters(config.parameters),
      inferenceParameters: this.parseInferenceParameters(config.inferenceParameters),
      preprocessing: this.parseProcessingSteps(config.preprocessing),
      postprocessing: this.parseProcessingSteps(config.postprocessing),
      layout: config.layout,
      localization: config.localization
    };
  }

  private parseModelImplementation(modelImpl: any): ParsedModelImplementation {
    return {
      name: modelImpl.name,
      version: modelImpl.version,
      framework: modelImpl.framework
    };
  }

  private parseMetadata(metadata: any): ParsedMetadata {
    return {
      name: metadata.name,
      description: metadata.description,
      author: metadata.author,
      dateCreated: new Date(metadata.dateCreated),
      lastModified: new Date(metadata.lastModified)
    };
  }

  private parseParameters(parameters: any[]): ParsedParameter[] {
    return parameters.map(param => this.parseParameter(param));
  }

  private parseParameter(param: any): ParsedParameter {
    return {
      id: param.id,
      name: param.name,
      description: param.description,
      type: param.type,
      widgetType: param.widgetType,
      category: param.category,
      applicableTo: param.applicableTo,
      default: param.default,
      validation: param.validation,
      options: param.options,
      children: param.children ? this.parseParameters(param.children) : undefined,
      properties: param.properties
    };
  }

  private parseInferenceParameters(params: any): ParsedInferenceParameters {
    return {
      batchSize: params.batchSize,
      deviceType: params.deviceType,
      quantization: params.quantization,
      modelPath: params.modelPath,
      confidenceThreshold: params.confidenceThreshold,
      maxNewTokens: params.maxNewTokens
    };
  }

  private parseProcessingSteps(steps: any[]): ParsedProcessingStep[] {
    return steps.map(step => ({
      operation: step.operation,
      parameters: step.parameters
    }));
  }
}

// Add interfaces for parsed structures (ParsedConfig, ParsedParameter, etc.)
