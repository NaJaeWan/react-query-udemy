import React from 'react';
import axios from 'axios';
import { useQuery, useQueryClient, useMutation } from 'react-query';

import useInput from './useInput.jsx';

async function updateItem(itemId, itemName, itemPrice) {
	const response = await axios.post('http://localhost:3001/data', {
		id: itemId,
		name: itemName,
		price: itemPrice,
	});
	return response.data;
}
async function fetchItem() {
	const response = await axios.get('http://localhost:3001/data');
	return response.data;
}

export default function Items() {
	const itemId = useInput();
	const itemName = useInput();
	const itemPrice = useInput();
	const { data, error, isLoading, isError } = useQuery('fetch', fetchItem);
	const updateItemMutation = useMutation(() =>
		updateItem(itemId.value, itemName.value, itemPrice.value)
	);

	return (
		<div>
			<ul style={{ listStyle: 'none' }}>
				<li>
					<label>id : </label>
					<input onChange={itemId.onChange} type="number"></input>
					<p>{itemId.value}</p>
				</li>
				<li>
					<label>name : </label>
					<input onChange={itemName.onChange} type="text"></input>
					<p> {itemName.value}</p>
				</li>
				<li>
					<label>price : </label>
					<input onChange={itemPrice.onChange} type="number"></input>
					<p></p>
					{itemPrice.value}
				</li>
			</ul>
			<button
				onClick={() =>
					updateItemMutation.mutate(
						itemId.value,
						itemName.value,
						itemPrice.value
					)
				}
			>
				전송
			</button>
			<h1>Item List</h1>
			{!isLoading &&
				data.map((v, i) => {
					return (
						<div>
							<span key={i}>{i + 1} : </span>
							<p>ID : {v.id}</p>
							<p>Name : {v.name}</p>
							<p>Price :{v.price}</p>
						</div>
					);
				})}
		</div>
	);
}
