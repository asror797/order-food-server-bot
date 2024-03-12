import { ValidationError, validate } from 'class-validator';

export class ValidationService {
  async validateDto(dto: any): Promise<string[]> {
    try {
      await validate(dto);
      return [];
    } catch (errors) {
      return this.formatErrors(errors as ValidationError[])
    }
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.flatMap(error =>
      Object.values(error.constraints || {}).map(message => `${error.property}: ${message}`)
    );
  }
}


export const validationServiceInstance = new ValidationService()
