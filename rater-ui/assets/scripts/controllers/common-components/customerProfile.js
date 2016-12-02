const Component = React.createClass({
    render() {
        const customer = this.props.customer;

        return (
            <article className="user-profile customer">
                {this._linkedinProfilePic(customer.linkedinProfile)}
                <div>
                    <p>{customer.firstName} {customer.lastName}</p>
                    <p>{customer.emailAddress}</p>
                </div>
            </article>);
    },

    _linkedinProfilePic(linkedinProfile) {
        if (!linkedinProfile) {
            return null;
        }

        const style = {backgroundImage: `url(${linkedinProfile.pictureUrl})`};

        return <div className="profile-picture" style={style}></div>;
    }
});

export {Component as default};
