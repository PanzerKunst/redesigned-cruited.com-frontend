const Component = React.createClass({
    render() {
        const position = this.props.position;

        if (!position) {
            return null;
        }

        return <p className="position-sought" >{position}</p>;
    }
});

export {Component as default};
