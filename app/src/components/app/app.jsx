import React from "react";
import {BrowserRouter, Switch, Route, useLocation} from "react-router-dom";
import VacancyShareBanner from "../vacancy-share-banner/vacancy-share-banner";

const App = (props) => {
	console.log(props.location.query);
	// function useQuery() {
	//
	// 	return new URLSearchParams(useLocation());
	// }
	//
	// const query = useQuery();

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path={`/api/render/careers`}>
					<VacancyShareBanner
						// location={query.get(`location`)}
						// job={query.get(`job`)}
						// image={query.get(`image`)}
						// bg={query.get(`bg`)}
					/>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
