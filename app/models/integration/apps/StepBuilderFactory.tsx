import type { StepBuilder } from './slack/components/SlackStepBuilder'
import { SlackStepBuilder } from './slack/components/SlackStepBuilder'

export type IntegrationService = 'slack' | 'notion' | 'github' | 'linear'

export class StepBuilderFactory {
  static create(service: IntegrationService): StepBuilder {
    switch (service) {
      case 'slack':
        return SlackStepBuilder()
      
      case 'notion':
        // TODO: Implement NotionStepBuilder
        throw new Error('Notion integration not implemented yet')
      
      case 'github':
        // TODO: Implement GitHubStepBuilder  
        throw new Error('GitHub integration not implemented yet')
      
      case 'linear':
        // TODO: Implement LinearStepBuilder
        throw new Error('Linear integration not implemented yet')
      
      default:
        throw new Error(`Unsupported integration service: ${service}`)
    }
  }

  static getSupportedServices(): IntegrationService[] {
    return ['slack'] // Add more as they're implemented
  }

  static isServiceSupported(service: IntegrationService): boolean {
    return this.getSupportedServices().includes(service)
  }
}