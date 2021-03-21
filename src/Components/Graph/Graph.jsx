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
import Button from "@material-ui/core/Button";
import { generatePath } from "react-router-dom";

const GraphConfig = {
	NodeTypes: {
		empty: {
			typeText: "Node",
			shapeId: "#empty", // relates to the type property of a node
			shape: (
				<symbol viewBox="0 0 100 100" id="empty" key="0">
					<circle cx="50" cy="50" r="50"></circle>
				</symbol>
			),
		},
	},
	NodeSubtypes: {},
	EdgeTypes: {
		emptyEdge: {
			shapeId: "#emptyEdge",
			shape: (
				<symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
					<circle cx="25" cy="25" r="20" fill="currentColor"></circle>
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
			handleText: "saddddddddddd",
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
			graphConfig: GraphConfig,
			selected: {},
			input: {
				title: "",
				field: "",
				data: {},
			},
			formVisible: false,
		};
	}

	handleSubmit = (event) => {
		const { title, field, data } = this.state.input;
		const { graph } = this.state;
		if (field === "node") {
			data.title = title;
			var newSample = graph.nodes.map((value, index) => {
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
		} else if (field === "edge") {
			data.handleText = title;
			var newSample = graph.edges.map((value, index) => {
				if (
					value.source === data.source &&
					value.target === data.target
				) {
					return data;
				}
				return value;
			});
			this.setState({
				graph: {
					...this.state.graph,
					edges: newSample,
				},
				formVisible: false,
				input: {
					title: "",
					field: "",
					data: {},
				},
			});
		} else if (field === "nodeType") {
			const { graphConfig } = this.state;
			if (
				graphConfig.NodeTypes &&
				Object.keys(graphConfig.NodeTypes).includes(title)
			) {
			} else {
				graphConfig.NodeTypes[title] = {
					typeText: title,
					shapeId: "#empty",
					shape: (
						<symbol viewBox="0 0 100 100" id="empty" key="0">
							<circle cx="50" cy="50" r="50"></circle>
						</symbol>
					),
				};
				this.setState({
					graphConfig: graphConfig,
				});
			}
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
		if (!node) {
			return;
		}
		this.setState({
			formVisible: true,
			input: {
				title: node && node.title,
				field: "node",
				data: node,
			},
			selected: node,
		});
	};

	onCreateNode = (x, y, event) => {
		const { graph } = this.state;
		debugger;
		var node = {
			id: Date.now(),
			title: "Sample",
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

	onDeleteNode = (node) => {
		const { graph } = this.state;
		this.setState({
			graph: {
				...graph,
				nodes: [...graph.nodes.filter((value) => value.id !== node.id)],
			},
		});
	};

	onBackgroundClick = (x, y, event) => {
		this.setState({
			formVisible: false,
			input: {
				title: "",
				field: "",
				data: {},
			},
			selected: {},
		});
	};

	onSelectEdge = (edge) => {
		if (!edge) {
			return;
		}
		this.setState({
			formVisible: true,
			input: {
				title: edge && edge.handleText && edge.handleText,
				field: "edge",
				data: edge,
			},
			selected: edge,
		});
	};

	onCreateEdge = (source, dest) => {
		const { graph } = this.state;
		debugger;
		var edge = {
			source: source.id,
			target: dest.id,
			type: "emptyEdge",
			handleText: "",
		};

		this.setState({
			graph: {
				...graph,
				edges: [...graph.edges, edge],
			},
		});
	};

	onDeleteEdge = (edge) => {
		debugger;
		const { graph } = this.state;
		this.setState({
			graph: {
				...graph,
				edges: [
					...graph.edges.filter(
						(value) =>
							value.source !== edge.source &&
							value.target !== edge.target
					),
				],
			},
		});
	};

	createNodeType = () => {
		this.setState({
			formVisible: true,
			input: {
				title: "",
				field: "nodeType",
				data: {},
			},
			selected: {},
		});
	};

	render() {
		const { nodes, edges } = this.state.graph;
		const { selected, formVisible } = this.state;
		const { title } = this.state.input;
		const { NodeTypes, NodeSubtypes, EdgeTypes } = this.state.graphConfig;

		const display = {
			display: "block",
		};

		const noDisplay = {
			display: "none",
		};

		return (
			<div id="graph">
				<Button
					variant="contained"
					color="primary"
					onClick={this.createNodeType}
				>
					Create Node Type
				</Button>
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
