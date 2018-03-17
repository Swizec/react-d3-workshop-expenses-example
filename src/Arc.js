import React, { Component } from "react";
import * as d3 from "d3";

// inspired from http://bl.ocks.org/mbostock/5100636
function arcTween(oldData, newData, arc) {
    const copy = { ...oldData };
    return function() {
        const interpolateStartAngle = d3.interpolate(
                oldData.startAngle,
                newData.startAngle
            ),
            interpolateEndAngle = d3.interpolate(
                oldData.endAngle,
                newData.endAngle
            );

        return function(t) {
            copy.startAngle = interpolateStartAngle(t);
            copy.endAngle = interpolateEndAngle(t);
            return arc(copy);
        };
    };
}

class Arc extends Component {
    arc = d3
        .arc()
        .innerRadius(80)
        .outerRadius(150)
        .cornerRadius(8);

    constructor(props) {
        super(props);

        this.state = {
            color: props.color,
            origCol: props.color,
            d: props.d,
            pathD: this.arc(props.d)
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            color: newProps.color
        });

        d3
            .select(this.refs.elem)
            .transition()
            .duration(80)
            .attrTween("d", arcTween(this.state.d, newProps.d, this.arc))
            .on("end", () =>
                this.setState({
                    d: newProps.d
                    //pathD: this.arc(newProps.d)
                })
            );
    }

    hover = () => {
        this.props.selectTag(this.props.d.data.tag);
    };

    unhover = () => {
        this.props.selectTag(null);
    };

    render() {
        const { color, pathD, d } = this.state,
            { selected } = this.props;

        return (
            <path
                d={pathD}
                style={{
                    fill: selected ? color.saturate(2) : color
                }}
                onMouseOver={this.hover}
                onMouseOut={this.unhover}
                ref="elem"
            />
        );
    }
}

export default Arc;
