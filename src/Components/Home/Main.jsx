import React, { Component } from "react";
import "./Main.scss";

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
		return <div>I am Main</div>;
	}
}

export default Main;
