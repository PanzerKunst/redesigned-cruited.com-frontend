const Component = props => {
    const employer = props.employer;

    if (!employer) {
        return null;
    }

    return (
        <p className="employer-sought" >
            <i className="fa fa-building-o" />
            <span>{employer}</span>
        </p>);
};

export {Component as default};
