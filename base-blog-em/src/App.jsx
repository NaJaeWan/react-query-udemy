import { Posts } from './Posts';
import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Items from './Items';
function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	});

	return (
		// provide React Query client to App
		<QueryClientProvider client={queryClient}>
			<div className="App">
				{/* <h1>Blog Posts</h1> */}
				<Items />
				{/* <Posts /> */}
			</div>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default App;
