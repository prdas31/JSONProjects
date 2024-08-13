// text-input.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  template: `
    <div>
      <label [for]="id">{{name}}</label>
      <input [id]="id" type="text" [formControl]="formControl">
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class TextInputComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() formControl!: FormControl;
}

// number-input.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  template: `
    <div>
      <label [for]="id">{{name}}</label>
      <input [id]="id" type="number" [formControl]="formControl" [min]="min" [max]="max" [step]="step">
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class NumberInputComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() formControl!: FormControl;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
}

// checkbox.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  template: `
    <div>
      <input [id]="id" type="checkbox" [formControl]="formControl">
      <label [for]="id">{{name}}</label>
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class CheckboxComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() formControl!: FormControl;
}

// dropdown.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  template: `
    <div>
      <label [for]="id">{{name}}</label>
      <select [id]="id" [formControl]="formControl">
        <option *ngFor="let option of options" [value]="option.value">{{option.label}}</option>
      </select>
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class DropdownComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() formControl!: FormControl;
  @Input() options!: {label: string, value: any}[];
}

// slider.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-slider',
  template: `
    <div>
      <label [for]="id">{{name}}</label>
      <input [id]="id" type="range" [formControl]="formControl" [min]="min" [max]="max" [step]="step">
      <span>{{formControl.value}}</span>
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class SliderComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() formControl!: FormControl;
  @Input() min!: number;
  @Input() max!: number;
  @Input() step!: number;
}

// multiselect.component.ts
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-multiselect',
  template: `
    <div>
      <label>{{name}}</label>
      <div *ngFor="let option of options">
        <input type="checkbox" [id]="option.value" [value]="option.value" (change)="onCheckboxChange($event)">
        <label [for]="option.value">{{option.label}}</label>
      </div>
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class MultiselectComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() formControl!: FormControl;
  @Input() options!: {label: string, value: any}[];

  onCheckboxChange(event: any) {
    const selectedValues = this.formControl.value || [];
    if (event.target.checked) {
      selectedValues.push(event.target.value);
    } else {
      const index = selectedValues.indexOf(event.target.value);
      if (index >= 0) {
        selectedValues.splice(index, 1);
      }
    }
    this.formControl.setValue(selectedValues);
  }
}

// group.component.ts
import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-group',
  template: `
    <div>
      <h3>{{name}}</h3>
      <ng-container #childContainer></ng-container>
      <span *ngIf="description">{{description}}</span>
    </div>
  `
})
export class GroupComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description!: string;
  @ViewChild('childContainer',