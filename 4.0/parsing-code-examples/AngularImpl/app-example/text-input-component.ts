
/* you'll need to create the individual widget components (TextInputComponent, NumberInputComponent, etc.) that are used in the WidgetGeneratorService. Here's an example of what the TextInputComponent might look like: */

import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  template: `
    <div>
      <label [for]="id">{{ name }}</label>
      <input [id]="id" type="text" [formControl]="formControl">
      <p *ngIf="description">{{ description }}</p>
    </div>
  `
})
export class TextInputComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() description?: string;
  @Input() formControl!: FormControl;
}
