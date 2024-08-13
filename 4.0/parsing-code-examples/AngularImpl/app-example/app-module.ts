import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { YoloConfigFormComponent } from './yolo-config-form.component';
import { ConfigParserService } from './config-parser.service';
import { WidgetGeneratorService } from './widget-generator.service';
import { LayoutService } from './layout.service';
import { LocalizationService } from './localization.service';
import { TextInputComponent } from './components/text-input.component';
import { NumberInputComponent } from './components/number-input.component';
import { CheckboxComponent } from './components/checkbox.component';
import { DropdownComponent } from './components/dropdown.component';
import { SliderComponent } from './components/slider.component';
import { MultiselectComponent } from './components/multiselect.component';
import { GroupComponent } from './components/group.component';

@NgModule({
  declarations: [
    YoloConfigFormComponent,
    TextInputComponent,
    NumberInputComponent,
    CheckboxComponent,
    DropdownComponent,
    SliderComponent,
    MultiselectComponent,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [
    ConfigParserService,
    WidgetGeneratorService,
    LayoutService,
    LocalizationService
  ],
  bootstrap: [YoloConfigFormComponent]
})
export class AppModule { }
