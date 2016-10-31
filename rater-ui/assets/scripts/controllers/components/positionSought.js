const Component = React.createClass({
    render() {
        const position = this.props.position;

        if (!position) {
            return null;
        }

        return <span className="position-sought" >{position}</span>;
    }
});

export {Component as default};
