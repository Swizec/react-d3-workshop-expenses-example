import React, { Component } from "react";
import { csv as d3Csv } from "d3-request";
import { scaleOrdinal } from "d3";
import * as chroma from "chroma-js";
import _ from "lodash";

import logo from "./logo.svg";
import "./App.css";
import { groupByFunc } from "./util";

import Piechart from "./Piechart";
import Barchart from "./Barchart";

class App extends Component {
    state = {
        data: [],
        cachedData: [],
        selectedTag: null
    };
    colorScale = chroma.scale("PuBu");
    colorIndex = scaleOrdinal();

    componentDidMount() {
        d3Csv(
            "transport.csv",
            d => ({
                ...d,
                amount: Number(d["In main currency"].replace(",", ""))
            }),
            (error, cachedData) => {
                if (error) {
                    console.error(error);
                }

                const tags = Object.keys(
                    groupByFunc(cachedData, d => d.Tags.split(", ").sort())
                );

                this.colorScale.colors(tags);
                this.colorIndex
                    .domain(tags)
                    .range(tags.map((_, i) => i / tags.length));

                this.setState({
                    cachedData,
                    cacheIndex: 0
                });
                this.startTrickle();
            }
        );
    }

    startTrickle() {
        this.timer = setInterval(() => {
            let { data, cachedData, cacheIndex } = this.state;

            if (cacheIndex < cachedData.length) {
                this.setState({
                    data: [...data, cachedData[cacheIndex]],
                    cacheIndex: cacheIndex + 1
                });
            } else {
                this.stop();
            }
        }, 100);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    stop() {
        clearInterval(this.timer);
    }

    color(tag) {
        return this.colorScale(this.colorIndex(tag));
    }

    selectTag = tag => this.setState({ selectedTag: tag });

    render() {
        let { data, selectedTag, cachedData } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">A pie chart with transitions</h1>
                </header>
                <h3>{selectedTag || "<hover something>"}</h3>
                <p className="App-intro">
                    <svg width="1024" height="600">
                        <Piechart
                            data={data}
                            color={d => this.color(d.data.tag)}
                            groupBy={d => d.Tags.split(", ").sort()}
                            x={250}
                            y={300}
                            selectTag={this.selectTag}
                            selectedTag={selectedTag}
                        />
                        <Barchart
                            data={data}
                            color={d => this.color(d.tag)}
                            groupBy={d => d.Tags.split(", ").sort()}
                            x={600}
                            y={500}
                            width={400}
                            height={400}
                            selectTag={this.selectTag}
                            selectedTag={selectedTag}
                        />
                    </svg>
                </p>
            </div>
        );
    }
}

export default App;
