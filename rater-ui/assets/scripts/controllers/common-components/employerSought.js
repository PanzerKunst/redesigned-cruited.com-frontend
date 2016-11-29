const Component = React.createClass({
    render() {
        const employer = this.props.employer;

        if (!employer) {
            return null;
        }

        return <p className="employer-sought" >{employer}</p>;
    }
});

export {Component as default};
