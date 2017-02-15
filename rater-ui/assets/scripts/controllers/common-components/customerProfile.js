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
        if (!linkedinProfile || !linkedinProfile.pictureUrl) {
            return null;
        }

        const style = {backgroundImage: `url(${linkedinProfile.pictureUrl})`};

        return <a href={linkedinProfile.publicProfileUrl} target="_blank" className="profile-picture" style={style}/>;
    }
});

export {Component as default};
