import React, { Component } from "react";
import "./Graph.scss";
import {
	GraphView, // required
	Edge, // optional
	type IEdge, // optional
	Node, // optional
	type INode, // optional
	type LayoutEngineType, // required to change the layoutEngineType, otherwise optional
	BwdlTransformer, // optional, Example JSON transformer
	GraphUtils, // optional, useful utility functions
} from "react-digraph";
import { generatePath } from "react-router-dom";

const GraphConfig = {
	NodeTypes: {
		empty: {
			// required to show empty nodes
			typeText: "Node",
			shapeId: "#empty", // relates to the type property of a node
			shape: (
				<symbol viewBox="0 0 100 100" id="empty" key="0">
					<circle cx="50" cy="50" r="45"></circle>
				</symbol>
			),
		},
		custom: {
			// required to show empty nodes
			typeText: "Custom",
			shapeId: "#custom", // relates to the type property of a node
			shape: (
				<symbol viewBox="0 0 50 25" id="custom" key="0">
					<ellipse cx="50" cy="25" rx="50" ry="25"></ellipse>
				</symbol>
			),
		},
	},
	NodeSubtypes: {},
	EdgeTypes: {
		emptyEdge: {
			// required to show empty edges
			shapeId: "#emptyEdge",
			shape: (
				<symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
					<circle cx="25" cy="25" r="8" fill="currentColor">
						{" "}
					</circle>
				</symbol>
			),
		},
	},
};

const sample = {
	nodes: [
		{
			id: 1,
			title: "Node A",
			x: 258.3976135253906,
			y: 331.9783248901367,
			type: "empty",
		},
		{
			id: 2,
			title: "Node B",
			x: 593.9393920898438,
			y: 260.6060791015625,
			type: "empty",
		},
		{
			id: 3,
			title: "Node C",
			x: 237.5757598876953,
			y: 61.81818389892578,
			type: "empty",
		},
		{
			id: 4,
			title: "Node C",
			x: 600.5757598876953,
			y: 600.81818389892578,
			type: "empty",
			subtype: "empty",
		},
	],
	edges: [
		{
			source: 1,
			target: 2,
			type: "emptyEdge",
		},
		{
			source: 2,
			target: 4,
			type: "emptyEdge",
		},
	],
};

const NODE_KEY = "id"; // Allows D3 to correctly update DOM

class Graph extends Component {
	constructor(props) {
		super(props);

		this.state = {
			graph: sample,
			selected: {},
			input: {
				title: "",
				field: "",
				data: {},
			},
			formVisible: false,
		};
	}

	/* Define custom graph editing methods here */

	handleSubmit = (event) => {
		const { title, field, data } = this.state.input;
		const { graph } = this.state;
		data.title = title;
		if (field === "node") {
			var newSample = sample.nodes.map((value, index) => {
				if (value.id === data.id) {
					return data;
				}
				return value;
			});
			this.setState({
				graph: {
					...this.state.graph,
					nodes: newSample,
				},
				formVisible: false,
				input: {
					title: "",
					field: "",
					data: {},
				},
			});
		}
		event.preventDefault();
	};

	handleTitleChange = (event) => {
		var name = event.target.name;
		this.setState({
			input: {
				...this.state.input,
				title: event.target.value,
			},
		});
		event.preventDefault();
	};

	onSelectNode = (node) => {
		this.setState({
			formVisible: true,
			input: {
				title: node && node.title,
				field: "node",
				data: node,
			},
		});
	};

	onCreateNode = (x, y, event) => {
		const { graph } = this.state;

		var node = {
			id: Date.now(),
			title: "Sample Title",
			x: x,
			y: y,
			type: "empty",
		};

		this.setState({
			graph: {
				...graph,
				nodes: [...graph.nodes, node],
			},
		});
	};

	onBackgroundClick = (x, y, event) => {
		debugger;
		this.setState({
			formVisible: false,
			input: {
				title: "",
				field: "",
				data: {},
			},
		});
	};

	render() {
		const { nodes, edges } = this.state.graph;
		const { selected, formVisible } = this.state;
		const { title } = this.state.input;
		const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;

		const display = {
			display: "block",
		};

		const noDisplay = {
			display: "none",
		};

		return (
			<div id="graph">
				<div id="dataForm" style={formVisible ? display : noDisplay}>
					<form onSubmit={this.handleSubmit}>
						<label>
							title:
							<input
								type="text"
								value={title}
								name="title"
								onChange={this.handleTitleChange}
							/>
						</label>
						<input type="submit" name="submit" value="Submit" />
					</form>
				</div>
				<GraphView
					ref="GraphView"
					nodeKey={NODE_KEY}
					nodes={nodes}
					edges={edges}
					selected={selected}
					nodeTypes={NodeTypes}
					nodeSubtypes={NodeSubtypes}
					edgeTypes={EdgeTypes}
					onSelectNode={this.onSelectNode}
					onCreateNode={this.onCreateNode}
					onUpdateNode={this.onUpdateNode}
					onBackgroundClick={this.onBackgroundClick}
					onDeleteNode={this.onDeleteNode}
					onSelectEdge={this.onSelectEdge}
					onCreateEdge={this.onCreateEdge}
					onSwapEdge={this.onSwapEdge}
					onDeleteEdge={this.onDeleteEdge}
				/>
			</div>
		);
	}
}

export default Graph;
