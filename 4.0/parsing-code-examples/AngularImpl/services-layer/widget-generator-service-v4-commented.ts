import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSourceService } from './data-source.service';
import { CustomValidatorService } from './custom-validator.service';

// Import your widget components here
import { TextInputComponent } from './components/text-input.component';
import { NumberInputComponent } from './components/number-input.component';
import { CheckboxComponent } from './components/checkbox.component';
import { DropdownComponent } from './components/dropdown.component';
import { SliderComponent } from './components/slider.component';
import { MultiselectComponent } from './components/multiselect.component';
import { GroupComponent } from './components/group.component';

/**
 * Service responsible for generating UI widgets based on the parsed configuration
 */
@Injectable({
  providedIn: 'root'
})
export class WidgetGeneratorService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private dataSourceService: DataSourceService,
    private customValidatorService: CustomValidatorService
  ) {}

  /**
   * Generates a widget based on the provided parameter configuration
   * @param param The parsed parameter configuration
   * @param container The view container to add the widget to
   * @param formGroup The form group to add the widget's control to
   * @returns A reference to the created component
   */
  generateWidget(param: ParsedParameter, container: ViewContainerRef, formGroup: FormGroup) {
    const componentType = this.getComponentType(param.widgetType);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const componentRef = container.createComponent(componentFactory);
    
    // Set common properties
    componentRef.instance.id = param.id;
    componentRef.instance.name = param.name;
    componentRef.instance.description = param.description;
    componentRef.instance.required = param.required;

    // Set widget-specific properties
    this.setWidgetProperties(componentRef.instance, param);

    // Create form control and add to form group
    const control = this.createFormControl(param);
    formGroup.addControl(param.id, control);
    componentRef.instance.formControl = control;

    // Handle data source if specified
    if (param.dataSource) {
      this.handleDataSource(param.dataSource, componentRef.instance);
    }

    // Handle dependencies
    this.handleDependencies(param, componentRef.instance, formGroup);

    // Recursively generate child widgets if any
    if (param.children) {
      const childFormGroup = this.formBuilder.group({});
      formGroup.addControl(param.id, childFormGroup);
      param.children.forEach(childParam => {
        this.generateWidget(childParam, componentRef.instance.childContainer, childFormGroup);
      });
    }

    return componentRef;
  }

  /**
   * Determines the appropriate component type based on the widget type
   * @param widgetType The type of widget to create
   * @returns The component type to use for the widget
   */
  private getComponentType(widgetType: string) {
    switch (widgetType) {
      case 'text': return TextInputComponent;
      case 'number': return NumberInputComponent;
      case 'checkbox': return CheckboxComponent;
      case 'dropdown': return DropdownComponent;
      case 'slider': return SliderComponent;
      case 'multiselect': return MultiselectComponent;
      case 'group': return GroupComponent;
      // Add cases for other widget types
      default: throw new Error(`Unsupported widget type: ${widgetType}`);
    }
  }

  /**
   * Sets widget-specific properties on the component instance
   * @param instance The component instance
   * @param param The parsed parameter configuration
   */
  private setWidgetProperties(instance: any, param: ParsedParameter) {
    if (param.options) {
      instance.options = param.options;
    }
    if (param.validation) {
      instance.min = param.validation.min;
      instance.max = param.validation.max;
      instance.step = param.validation.step;
    }
    // Set other widget-specific properties as needed
  }

  /**
   * Creates a form control for the parameter
   * @param param The parsed parameter configuration
   * @returns A form control
   */
  private createFormControl(param: ParsedParameter) {
    const validators = [];
    
    if (param.required) {
      validators.push(Validators.required);
    }

    if (param.validation) {
      if (param.validation.min !== undefined) {
        validators.push(Validators.min(param.validation.min));
      }
      if (param.validation.max !== undefined) {
        validators.push(Validators.max(param.validation.max));
      }
      if (param.validation.regex) {
        validators.push(Validators.pattern(param.validation.regex));
      }
      if (param.validation.customValidation) {
        validators.push(this.customValidatorService.createValidator(param.validation.customValidation));
      }
    }

    return this.formBuilder.control(param.default, validators);
  }

  /**
   * Handles data source configuration for a widget
   * @param dataSource The data source configuration
   * @param instance The component instance
   */
  private handleDataSource(dataSource: ParsedDataSource, instance: any) {
    this.dataSourceService.fetchData(dataSource).subscribe(
      data => {
        instance.options = data;
        // You might need to update the form control value if it depends on the fetched data
      },
      error => {
        console.error('Error fetching data:', error);
        // Handle the error appropriately
      }
    );
  }

  /**
   * Handles dependencies between widgets
   * @param param The parsed parameter configuration
   * @param instance The component instance
   * @param formGroup The form group containing the widgets
   */
  private handleDependencies(param: ParsedParameter, instance: any, formGroup: FormGroup) {
    if (!param.dependencies) return;

    param.dependencies.forEach(dep => {
      const dependentControl = formGroup.get(dep.on);
      if (dependentControl) {
        dependentControl.valueChanges.subscribe(value => {
          const conditionMet = this.evaluateCondition(dep.condition, value);
          this.performAction(dep.action, instance, conditionMet);
        });
      }
    });
  }

  /**
   * Evaluates a dependency condition
   * @param condition The condition to evaluate
   * @param value The current value of the dependent control
   * @returns True if the condition is met, false otherwise
   */
  private evaluateCondition(condition: string, value: any): boolean {
    // Implement condition evaluation logic
    // This could involve parsing the condition string and evaluating it against the value
    console.warn('Condition evaluation not implemented');
    return true; // Placeholder
  }

  /**
   * Performs an action based on a dependency condition
   * @param action The action to perform
   * @param instance The component instance
   * @param conditionMet Whether the dependency condition was met
   */
  private performAction(action: string, instance: any, conditionMet: boolean) {
    // Implement action performance logic (e.g., show/hide, enable/disable)
    switch (action) {
      case 'show':
        instance.visible = conditionMet;
        break;
      case 'enable':
        instance.enabled = conditionMet;
        break;
      // Add other actions as needed
      default:
        console.warn(`Unsupported action: ${action}`);
    }
  }
}

// You may want to import these interfaces from a shared file
interface ParsedParameter {
  id: string;
  name: string;
  description: string;
  type: string;
  widgetType: string;
  default: any;
  required: boolean;
  validation?: ParsedValidation;
  options?: any[];
  dataSource?: ParsedDataSource;
  dependencies?: ParsedDependency[];
  children?: ParsedParameter[];
}

interface ParsedValidation {
  min?: number;
  max?: number;
  step?: number;
  regex?: string;
  customValidation?: string;
}

interface ParsedDataSource {
  type: string;
  endpoint?: string;
  method?: string;
  query?: string;
  functionName?: string;
}

interface ParsedDependency {
  on: string;
  condition: string;
  action: string;
}
