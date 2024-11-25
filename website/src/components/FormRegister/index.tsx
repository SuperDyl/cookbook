import React from "react";

export type FormRegisterProps = {
	cancelAction?: () => void;
	registerAction?: () => void;
};

export const FormRegister = ({
	cancelAction,
	registerAction,
}: FormRegisterProps) => {
	return (
		<div>
			<p style={{ marginTop: 0 }}>Register form</p>
			<button onClick={cancelAction}>Cancel</button>
			<button onClick={registerAction}>Register</button>
		</div>
	);
};
