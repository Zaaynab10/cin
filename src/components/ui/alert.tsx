// Expected: Generic alert for info/success/warning/error app messages.
type AlertProps = {
	children: string;
};

export function Alert({ children }: AlertProps) {
	return <div role="alert">{children}</div>;
}
