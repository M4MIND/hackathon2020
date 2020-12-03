import React from "react";
import path from "path";
import querystring from "querystring";
import PhotoPicker from "../../../libs/photoPicker/photo-picker"

const CardsList = (props) => {
	const {location, job, bg, team, photo} = props;

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
				<div className="sharing-image-container" style={{backgroundImage: `url(/banners/vacancy/${team}/${photo})`}}></div>
			</div>

			<div className="logo-container">
				<img src={`/banners/vacancy/miro-logo.svg`}/>
			</div>
		</div>
	);
};

export async function getServerSideProps(ctx) {
	const photo = await (await fetch(`http://localhost:3000/api/get-photo?${querystring.stringify(ctx.query)}`)).json();

	return {
		props: {
			location: ctx.query.location || 'location',
			job: ctx.query.job || 'job',
			bg: ctx.query.bg || 'FDF1C6',
			team: ctx.query.team || 'team',
			photo: photo.photo || '1.png'
		}
	};
}

export default CardsList;
