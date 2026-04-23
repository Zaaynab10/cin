// Expected: Standard application error class carrying code/status/field-level errors.
export class AppError extends Error {
	code: string;
	statusCode: number;
	fieldErrors?: Record<string, string[]>;

	constructor(
		code: string,
		message: string,
		statusCode = 400,
		fieldErrors?: Record<string, string[]>,
	) {
		super(message);
		this.code = code;
		this.statusCode = statusCode;
		this.fieldErrors = fieldErrors;
	}
}
