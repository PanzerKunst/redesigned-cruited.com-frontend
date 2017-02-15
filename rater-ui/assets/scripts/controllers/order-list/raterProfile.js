const Component = props => {
    const account = props.account;

    if (!account) {
        return (
            <article className="user-profile">
                <i className="fa fa-question-circle" aria-hidden="true"/>
                <p>Unassigned</p>
            </article>);
    }

    let myProfilePictureStyleAttr = null;
    const myLinkedinProfile = account.linkedinProfile;

    if (myLinkedinProfile) {
        myProfilePictureStyleAttr = {backgroundImage: `url(${myLinkedinProfile.pictureUrl})`};
    }

    return (
        <article className="user-profile">
            <div className="profile-picture" style={myProfilePictureStyleAttr}></div>
            <p>{account.firstName} {account.lastName}</p>
        </article>);
};

export {Component as default};
