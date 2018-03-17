import React, { Component } from "react";
import * as d3 from "d3";

import { groupByFunc } from "./util";
import Bar from "./Bar";

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
        const {
            x,
            y,
            data,
            groupBy,
            color,
            selectedTag,
            selectTag
        } = this.props;

        const _data = groupByFunc(data, groupBy);

        return (
            <g transform={`translate(${x}, ${y})`}>
                {_data.map((d, i) => (
                    <Bar
                        key={d.tag}
                        d={d}
                        x={this.xScale(d.tag)}
                        y={-this.yScale(d.amount)}
                        width={this.xScale.bandwidth()}
                        height={this.yScale(d.amount)}
                        selectTag={selectTag}
                        selected={selectedTag === d.tag}
                        color={color}
                    />
                ))}
            </g>
        );
    }
}

export default Barchart;
