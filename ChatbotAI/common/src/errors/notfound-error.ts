import { AppError } from "./app-error";
import { ErrorCode } from "../constants/error-codes";
import { HttpStatus } from "../constants/http-status";

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
  }
}
