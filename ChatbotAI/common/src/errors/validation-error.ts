import { AppError } from "./app-error";
import { ErrorCode } from "../constants/error-codes";
import { HttpStatus } from "../constants/http-status";

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super("Validation failed", HttpStatus.UNPROCESSABLE, ErrorCode.VALIDATION_ERROR);
    this.errors = errors;
  }
}
