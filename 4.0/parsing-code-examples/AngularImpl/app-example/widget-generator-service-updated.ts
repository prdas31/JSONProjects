import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextInputComponent } from './components/text-input.component';
import { NumberInputComponent } from './components/number-input.component';
import { CheckboxComponent } from './components/checkbox.component';
import { DropdownComponent } from './components/dropdown.component';
import { SliderComponent } from './components/slider.component';
import { MultiselectComponent } from './components/multiselect.component';
import { GroupComponent } from './components/group.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetGeneratorService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder
  ) {}

  generateWidget(param: ParsedParameter, container: ViewContainerRef, formGroup: FormGroup) {
    const componentType = this.getComponentType(param.widgetType);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const componentRef = container.createComponent(componentFactory);
    
    componentRef.instance.id = param.id;
    componentRef.instance.name = param.name;
    componentRef.instance.description = param.description;
    componentRef.instance.options = param.options;

    if (param.validation) {
      componentRef.instance.validation = param.validation;
    }

    const control = this.createFormControl(param);
    formGroup.addControl(param.id, control);
    componentRef.instance.formControl = control;

    if (param.children) {
      const childFormGroup = this.formBuilder.group({});
      formGroup.addControl(param.id, childFormGroup);
      const childContainer = (componentRef.instance as GroupComponent).childContainer;
      param.children.forEach(childParam => {
        this.generateWidget(childParam, childContainer, childFormGroup);
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

  private createFormControl(param: ParsedParameter) {
    const validators = [];
    if (param.validation) {
      if (param.validation.required) validators.push(Validators.required);
      if (param.validation.min !== undefined) validators.push(Validators.min(param.validation.min));
      if (param.validation.max !== undefined) validators.push(Validators.max(param.validation.max));
    }
    return this.formBuilder.control(param.default, validators);
  }
}
