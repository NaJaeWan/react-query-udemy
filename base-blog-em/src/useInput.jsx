import React, { useState } from 'react';

export default function useInput() {
	const [value, setValue] = useState();

	const onChange = (e) => {
		setValue(e.target.value);
	};

	const clear = () => {
		setValue('');
	}
	return { value: value, onChange: onChange, clear: clear };
}
