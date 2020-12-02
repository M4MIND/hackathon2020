import React from "react";

const VacancyShareBanner = ({location, job, image, bg}) => {
	return (
		<div className="container" style={{backgroundColor: bg}}>
			<div className="container-column">
				<div className="location">
					{location}
				</div>
				<div className="job-title">
					{job}
				</div>
			</div>
			<div className="container-column">
				<img src={image} />
			</div>

			<div className="logo-container">
				<img src={`img/miro-logo.svg`} />
			</div>
		</div>
	);
}

export default VacancyShareBanner;
