const Component = props => {
    const position = props.position || "&Oslash;";

    return (
        <p className="position-sought" >
            <i className="fa fa-address-card-o" />
            <span dangerouslySetInnerHTML={{__html: position}} />
        </p>);
};

export {Component as default};
