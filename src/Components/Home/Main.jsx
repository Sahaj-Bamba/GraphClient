import React, { Component } from "react";
import "./Main.scss";
import Graph from "../Graph/Graph";

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { activeMenu: "Home" };
	}

	changeMenu = (event, item) => {
		this.setState({
			activeMenu: item,
		});
		event.stopPropagation();
	};

	render() {
		return (
			<div className="Main">
				<div>I am Main</div>
				<Graph />
			</div>
		);
	}
}

export default Main;
