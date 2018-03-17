import React, { Component } from "react";
import * as d3 from "d3";

import { groupByFunc } from "./util";

class Barchart extends Component {
    xScale = d3.scaleBand().paddingInner(0.1);
    yScale = d3.scaleLinear();

    componentWillMount() {
        this.updateD3(this.props);
    }
    componentWillUpdate(nextProps) {
        this.updateD3(nextProps);
    }

    updateD3(props) {
        const { data, groupBy } = props;
        const _data = groupByFunc(data, groupBy);

        this.xScale.domain(_data.map(d => d.tag)).range([0, props.width]);
        this.yScale
            .domain([0, d3.max(_data, d => d.amount)])
            .range([0, props.height]);
    }

    render() {
        const { x, y, data, groupBy, color } = this.props;

        const _data = groupByFunc(data, groupBy);

        return (
            <g transform={`translate(${x}, ${y})`}>
                {_data.map((d, i) => (
                    <rect
                        key={d.tag}
                        x={this.xScale(d.tag)}
                        y={-this.yScale(d.amount)}
                        width={this.xScale.bandwidth()}
                        height={this.yScale(d.amount)}
                        style={{
                            fill: color(d)
                        }}
                    />
                ))}
            </g>
        );
    }
}

export default Barchart;
