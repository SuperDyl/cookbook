import React from "react";

export type LoginFormProps = {
	cancelAction?: () => void;
	loginAction?: () => void;
};

export const LoginForm = ({ cancelAction, loginAction }: LoginFormProps) => {
	return (
		<div>
			<p style={{ marginTop: 0 }}>log form</p>
			<button onClick={cancelAction}>Cancel</button>
			<button onClick={loginAction}>Login</button>
		</div>
	);
};
