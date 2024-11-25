import React from "react";

export type FormLoginProps = {
	cancelAction?: () => void;
	loginAction?: () => void;
};

export const FormLogin = ({ cancelAction, loginAction }: FormLoginProps) => {
	return (
		<div>
			<input
				type="text"
				placeholder="Username"
			></input>
			<input
				type="text"
				placeholder="Password"
			></input>
			<button onClick={cancelAction}>Cancel</button>
			<button onClick={loginAction}>Login</button>
		</div>
	);
};
