import React from "react";

const CardsList = (props) => {
	const {location, job, image, bg} = props;

	return (
		<div className="container" style={{backgroundColor: `#${bg}`}}>
			<div className="container-column">
				<div className="location">
					{location}
				</div>
				<div className="job-title">
					{job}
				</div>
			</div>
			<div className="container-column">
				<img src={`/banners/vacancy/${image}`} />
			</div>

			<div className="logo-container">
				<img src={`/banners/vacancy/miro-logo.svg`} />
			</div>
		</div>
	);
};

CardsList.getInitialProps = async (ctx) => {
	return ctx.query||{};
}

export default CardsList;
