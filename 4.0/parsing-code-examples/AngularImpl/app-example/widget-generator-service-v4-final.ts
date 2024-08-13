import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSourceService } from './data-source.service';
import { CustomValidatorService } from './custom-validator.service';
import { LocalizationService } from './localization.service';

// Import your widget components here
import { TextInputComponent } from '../components/text-input.component';
import { NumberInputComponent } from '../components/number-input.component';
import { CheckboxComponent } from '../components/checkbox.component';
import { DropdownComponent } from '../components/dropdown.component';
import { SliderComponent } from '../components/slider.component';
import { MultiselectComponent } from '../components/multiselect.component';
import { GroupComponent } from '../components/group.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetGeneratorService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private dataSourceService: DataSourceService,
    private customValidatorService: CustomValidatorService,
    private localizationService: LocalizationService
  ) {}

  generateWidget(param: any, container: ViewContainerRef, formGroup: FormGroup) {
    const componentType = this.getComponentType(param.widgetType);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const componentRef = container.createComponent(componentFactory);
    
    componentRef.instance.id = param.id;
    componentRef.instance.name = this.localizationService.translate(param.name);
    componentRef.instance.description = this.localizationService.translate(param.description);
    componentRef.instance.required = param.required;

    this.setWidgetProperties(componentRef.instance, param);

    const control = this.createFormControl(param);
    formGroup.addControl(param.id, control);
    componentRef.instance.formControl = control;

    if (param.dataSource) {
      this.handleDataSource(param.dataSource, componentRef.instance);
    }

    this.handleDependencies(param, componentRef.instance, formGroup);

    if (param.children) {
      const childFormGroup = this.formBuilder.group({});
      formGroup.addControl(param.id, childFormGroup);
      param.children.forEach((childParam: any) => {
        this.generateWidget(childParam, componentRef.instance.childContainer, childFormGroup);
      });
    }

    return componentRef;
  }

  private getComponentType(widgetType: string) {
    switch (widgetType) {
      case 'text': return TextInputComponent;
      case 'number': return NumberInputComponent;
      case 'checkbox': return CheckboxComponent;
      case 'dropdown': return DropdownComponent;
      case 'slider': return SliderComponent;
      case 'multiselect': return MultiselectComponent;
      case 'group': return GroupComponent;
      default: throw new Error(`Unsupported widget type: ${widgetType}`);
    }
  }

  private setWidgetProperties(instance: any, param: any) {
    if (param.options) {
      instance.options = param.options.map((option: any) => ({
        ...option,
        label: this.localizationService.translate(option.label)
      }));
    }
    if (param.validation) {
      instance.min = param.validation.min;
      instance.max = param.validation.max;
      instance.step = param.validation.step;
    }
  }

  private createFormControl(param: any) {
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

  private handleDataSource(dataSource: any, instance: any) {
    this.dataSourceService.fetchData(dataSource).subscribe(
      data => {
        instance.options = data.map((item: any) => ({
          ...item,
          label: this.localizationService.translate(item.label)
        }));
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  private handleDependencies(param: any, instance: any, formGroup: FormGroup) {
    if (!param.dependencies) return;

    param.dependencies.forEach((dep: any) => {
      const dependentControl = formGroup.get(dep.on);
      if (dependentControl) {
        dependentControl.valueChanges.subscribe(value => {
          const conditionMet = this.evaluateCondition(dep.condition, value);
          this.performAction(dep.action, instance, conditionMet);
        });
      }
    });
  }

  private evaluateCondition(condition: string, value: any): boolean {
    // Implement condition evaluation logic
    return new Function('value', `return ${condition}`)(value);
  }

  private performAction(action: string, instance: any, conditionMet: boolean) {
    switch (action) {
      case 'show':
        instance.visible = conditionMet;
        break;
      case 'enable':
        instance.enabled = conditionMet;
        break;
      default:
        console.warn(`Unsupported action: ${action}`);
    }
  }
}
