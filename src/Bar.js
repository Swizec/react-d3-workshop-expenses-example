import React, { Component } from "react";
import * as d3 from "d3";

class Bar extends Component {
    hover = () => {
        this.props.selectTag(this.props.d.tag);
    };

    unhover = () => {
        this.props.selectTag(null);
    };

    render() {
        const { x, y, width, height, selected, color, d } = this.props;

        return (
            <rect
                key={d.tag}
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: selected ? color(d).saturate(2) : color(d)
                }}
                onMouseOver={this.hover}
                onMouseOut={this.unhover}
            />
        );
    }
}

export default Bar;
