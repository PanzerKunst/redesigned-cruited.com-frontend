const Component = props => {
    const employer = props.employer || "&Oslash;";

    return (
        <p className="employer-sought" >
            <i className="fa fa-building-o" />
            <span dangerouslySetInnerHTML={{__html: employer}} />
        </p>);
};

export {Component as default};
