import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigParserService } from './config-parser.service';
import { WidgetGeneratorService } from './widget-generator.service';
import { LayoutService } from './layout.service';
import { LocalizationService } from './localization.service';

@Component({
  selector: 'app-yolo-config-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <ng-container #formContainer></ng-container>
      <button type="submit" [disabled]="!form.valid">{{ 'Submit' | translate }}</button>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
    }
  `]
})
export class YoloConfigFormComponent implements OnInit {
  @ViewChild('formContainer', { read: ViewContainerRef, static: true }) formContainer!: ViewContainerRef;
  
  form: FormGroup;
  config: any;

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
      this.config = this.configParserService.parseConfig(configJson);
      this.setupLocalization();
      this.generateForm();
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Handle error (e.g., display error message to user)
    }
  }

  private async fetchConfig(): Promise<any> {
    // In a real application, you'd fetch this from an API
    // For this example, we'll return the provided JSON directly
    return {
      // Paste the entire content of yolov8-user-configurable-inference-v4.json here
    };
  }

  private setupLocalization() {
    this.localizationService.setLocalizationData(this.config.localization);
    // Set initial locale (you might want to get this from user preferences or browser settings)
    this.localizationService.setLocale('en-US');
  }

  private generateForm() {
    this.formContainer.clear();

    this.config.parameters.forEach((param: any) => {
      this.widgetGeneratorService.generateWidget(param, this.formContainer, this.form);
    });

    if (this.config.layout) {
      this.layoutService.applyLayout(this.formContainer.element.nativeElement, this.config.layout);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log('Form submitted:', formValue);
      // Process the form data (e.g., send to backend)
    } else {
      console.error('Form is invalid');
      // Handle invalid form (e.g., display error messages)
    }
  }
}
