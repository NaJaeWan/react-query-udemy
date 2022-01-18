import React, { useState } from 'react';

export default function useInput() {
	const [value, setValue] = useState();

	const onChange = (e) => {
		setValue(e.target.value);
	};

	return { value: value, onChange: onChange };
<<<<<<< HEAD
}
=======
}
>>>>>>> main
