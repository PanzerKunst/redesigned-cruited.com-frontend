const Component = React.createClass({
    render() {
        const position = this.props.position;

        if (!position) {
            return null;
        }

        return (
            <p className="position-sought" >
                <i className="fa fa-address-card-o" />
                <span>{position}</span>
            </p>);
    }
});

export {Component as default};
