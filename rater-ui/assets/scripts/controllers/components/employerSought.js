const Component = React.createClass({
    render() {
        const employer = this.props.employer;

        if (!employer) {
            return null;
        }

        return <span className="employer-sought" >{employer}</span>;
    }
});

export {Component as default};
