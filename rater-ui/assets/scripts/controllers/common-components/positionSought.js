const Component = props => {
    const position = props.position || "&#8212;";

    return (
        <p className="position-sought" >
            <i className="fa fa-address-card-o" />
            <span dangerouslySetInnerHTML={{__html: position}} />
        </p>);
};

export {Component as default};
