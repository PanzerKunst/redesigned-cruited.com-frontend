const Component = React.createClass({
    render() {
        const account = this.props.account;

        if (!account) {
            return null;
        }

        let myProfilePictureStyleAttr = null;
        const myLinkedinProfile = account.linkedinProfile;

        if (myLinkedinProfile) {
            myProfilePictureStyleAttr = {backgroundImage: `url(${myLinkedinProfile.pictureUrl})`};
        }

        return (
            <article className="rater-profile">
                <div className="profile-picture" style={myProfilePictureStyleAttr}></div>
                <span>{account.firstName} {account.lastName}</span>
            </article>
        );
    }
});

export {Component as default};
