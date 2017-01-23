const Component = props => {
    const employer = props.employer || "&#8212;";

    return (
        <p className="employer-sought" >
            <i className="fa fa-building-o" />
            <span dangerouslySetInnerHTML={{__html: employer}} />
        </p>);
};

export {Component as default};
