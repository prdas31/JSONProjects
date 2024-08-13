import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorService {
  
  /**
   * Creates a validator function based on the provided validation string
   * @param validationString A string representation of the validation logic
   * @returns A validator function
   */
  createValidator(validationString: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      try {
        // Create a function from the validation string
        const validationFunction = new Function('value', `return ${validationString}`);
        
        // Execute the validation function
        const isValid = validationFunction(control.value);
        
        // Return null if valid, otherwise return an error object
        return isValid ? null : { 'customValidation': { value: control.value } };
      } catch (error) {
        console.error('Error in custom validation function:', error);
        // Return an error object if the validation function throws an error
        return { 'customValidationError': { value: control.value } };
      }
    };
  }

  /**
   * Creates a composite validator function from multiple validation rules
   * @param validationRules An object containing multiple validation rules
   * @returns A composite validator function
   */
  createCompositeValidator(validationRules: ValidationRules): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const validators: ValidatorFn[] = [];

      // Add built-in validators
      if (validationRules.required) {
        validators.push(Validators.required);
      }
      if (validationRules.min !== undefined) {
        validators.push(Validators.min(validationRules.min));
      }
      if (validationRules.max !== undefined) {
        validators.push(Validators.max(validationRules.max));
      }
      if (validationRules.minLength !== undefined) {
        validators.push(Validators.minLength(validationRules.minLength));
      }
      if (validationRules.maxLength !== undefined) {
        validators.push(Validators.maxLength(validationRules.maxLength));
      }
      if (validationRules.pattern) {
        validators.push(Validators.pattern(validationRules.pattern));
      }
      
      // Add custom validator if provided
      if (validationRules.custom) {
        validators.push(this.createValidator(validationRules.custom));
      }

      // Execute all validators
      for (const validator of validators) {
        const result = validator(control);
        if (result) {
          return result; // Return the first error encountered
        }
      }

      return null; // Return null if all validations pass
    };
  }

  /**
   * Validates a value against a set of validation rules
   * @param value The value to validate
   * @param rules The validation rules to apply
   * @returns An object containing the validation result and any error messages
   */
  validateValue(value: any, rules: ValidationRules): ValidationResult {
    const control = { value } as AbstractControl;
    const validator = this.createCompositeValidator(rules);
    const result = validator(control);

    return {
      isValid: result === null,
      errors: result || {}
    };
  }
}

/**
 * Interface representing a set of validation rules
 */
interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  custom?: string;
}

/**
 * Interface representing the result of a validation
 */
interface ValidationResult {
  isValid: boolean;
  errors: {[key: string]: any};
}
