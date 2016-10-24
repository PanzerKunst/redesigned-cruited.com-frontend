const RaterProfile = React.createClass({
    render() {
        const account = this.props.account;

        if (!this.props.account) {
            return null;
        }

        let myProfilePictureStyleAttr = null;
        const myLinkedinProfile = account.linkedinProfile;

        if (myLinkedinProfile) {
            myProfilePictureStyleAttr = {backgroundImage: "url(" + myLinkedinProfile.pictureUrl + ")"};
        }

        return (
            <article className="rater-profile">
                <div className="profile-picture" style={myProfilePictureStyleAttr}></div>
                <span>{account.firstName} {account.lastName}</span>
            </article>
        );
    }
});

export {RaterProfile as default};
