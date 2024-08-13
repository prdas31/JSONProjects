import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigParserService } from './services/config-parser.service';
import { WidgetGeneratorService } from './services/widget-generator.service';
import { LayoutService } from './services/layout.service';
import { LocalizationService } from './services/localization.service';

@Component({
  selector: 'app-config-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <ng-container #formContainer></ng-container>
      <button type="submit" [disabled]="!form.valid">{{ 'submit' | translate }}</button>
    </form>
  `
})
export class ConfigFormComponent implements OnInit {
  @ViewChild('formContainer', { read: ViewContainerRef }) formContainer!: ViewContainerRef;
  
  form: FormGroup;
  parsedConfig: any;

  constructor(
    private configParserService: ConfigParserService,
    private widgetGeneratorService: WidgetGeneratorService,
    private layoutService: LayoutService,
    private localizationService: LocalizationService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {
    this.loadConfiguration();
  }

  private async loadConfiguration() {
    try {
      const configJson = await this.fetchConfig();
      this.parsedConfig = this.configParserService.parseConfig(configJson);
      this.setupLocalization();
      this.generateForm();
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }

  private async fetchConfig(): Promise<any> {
    // In a real application, you'd fetch this from an API
    // For this example, we'll use the provided JSON
    return {
      // Paste the entire content of yolov8-user-configurable-inference-v4.json here
    };
  }

  private setupLocalization() {
    this.localizationService.setLocalizationData(this.parsedConfig.localization);
    // Set default locale, you might want to get this from user preferences or browser settings
    this.localizationService.setLocale('en-US');
  }

  private generateForm() {
    this.formContainer.clear();

    this.parsedConfig.parameters.forEach((param: any) => {
      this.widgetGeneratorService.generateWidget(param, this.formContainer, this.form);
    });

    this.applyLayout();
  }

  private applyLayout() {
    if (this.parsedConfig.layout) {
      this.layoutService.applyLayout(this.formContainer.element.nativeElement, this.parsedConfig.layout);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      // Process the form data
    } else {
      console.error('Form is invalid');
    }
  }
}
